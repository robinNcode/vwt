import { create } from 'zustand';
import api from './axios';

const GUEST_CART_KEY = 'vwt_guest_cart';

export interface CartItem {
    id: number;
    product_id?: number;
    service_id?: number;
    quantity: number;
    product?: any;
    service?: any;
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fetchCart: () => Promise<void>;
    addToCart: (params: { productId?: number; serviceId?: number; quantity: number; product?: any; service?: any }) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncGuestCartToServer: () => Promise<void>;
}

const getToken = () => localStorage.getItem('vwt_token');

const loadGuestCart = (): CartItem[] => {
    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveGuestCart = (items: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const getNextGuestItemID = (items: CartItem[]) => {
    const minGuestID = -1;
    const lowestID = items.reduce((min, item) => Math.min(min, item.id), 0);
    return lowestID < 0 ? lowestID - 1 : minGuestID;
};

const findMatchingItem = (items: CartItem[], productId?: number, serviceId?: number) =>
    items.find((item) => {
        if (productId) return item.product_id === productId;
        if (serviceId) return item.service_id === serviceId;
        return false;
    });

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    fetchCart: async () => {
        if (!getToken()) {
            set({ items: loadGuestCart() });
            return;
        }

        try {
            const res = await api.get('/cart');
            if (res.data.success && res.data.data) {
                set({ items: res.data.data.items || [] });
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    },
    addToCart: async ({ productId, serviceId, quantity, product, service }) => {
        if (!productId && !serviceId) {
            throw new Error('Product ID or Service ID is required');
        }

        if (!getToken()) {
            const items = loadGuestCart();
            const existingItem = findMatchingItem(items, productId, serviceId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                items.push({
                    id: getNextGuestItemID(items),
                    product_id: productId,
                    service_id: serviceId,
                    quantity,
                    product,
                    service,
                });
            }

            saveGuestCart(items);
            set({ items, isOpen: true });
            return;
        }

        try {
            const res = await api.post('/cart/items', {
                product_id: productId,
                service_id: serviceId,
                quantity
            });
            if (res.data.success && res.data.data) {
                set({ items: res.data.data.items || [] });
                set({ isOpen: true }); // Open cart upon adding
            }
        } catch (error) {
            console.error('Failed to add to cart', error);
            throw error;
        }
    },

    updateQuantity: async (itemId, quantity) => {
        if (!getToken()) {
            const nextItems = loadGuestCart()
                .map((item) => item.id === itemId ? { ...item, quantity } : item)
                .filter((item) => item.quantity > 0);
            saveGuestCart(nextItems);
            set({ items: nextItems });
            return;
        }

        try {
            const res = await api.put(`/cart/items/${itemId}`, { quantity });
            if (res.data.success && res.data.data) {
                set({ items: res.data.data.items || [] });
            }
        } catch (error) {
            console.error('Failed to update quantity', error);
        }
    },
    removeItem: async (itemId) => {
        if (!getToken()) {
            const nextItems = loadGuestCart().filter((item) => item.id !== itemId);
            saveGuestCart(nextItems);
            set({ items: nextItems });
            return;
        }

        try {
            const res = await api.delete(`/cart/items/${itemId}`);
            if (res.data.success && res.data.data) {
                set({ items: res.data.data.items || [] });
            }
        } catch (error) {
            console.error('Failed to remove item', error);
        }
    },
    clearCart: async () => {
        if (!getToken()) {
            saveGuestCart([]);
            set({ items: [] });
            return;
        }

        try {
            await api.delete('/cart');
            set({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart', error);
        }
    },
    syncGuestCartToServer: async () => {
        if (!getToken()) return;

        const guestItems = loadGuestCart();
        if (guestItems.length === 0) {
            await get().fetchCart();
            return;
        }

        try {
            for (const item of guestItems) {
                await api.post('/cart/items', {
                    product_id: item.product_id,
                    service_id: item.service_id,
                    quantity: item.quantity,
                });
            }
            saveGuestCart([]);
            await get().fetchCart();
        } catch (error) {
            console.error('Failed to sync guest cart', error);
            await get().fetchCart();
        }
    }
}));
