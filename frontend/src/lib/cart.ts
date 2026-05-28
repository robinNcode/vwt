import { create } from 'zustand';
import api from './axios';

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product?: any;
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    fetchCart: async () => {
        try {
            const res = await api.get('/cart');
            if (res.data.success && res.data.data) {
                set({ items: res.data.data.items || [] });
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    },
    addToCart: async (productId, quantity) => {
        try {
            const res = await api.post('/cart/items', { product_id: productId, quantity });
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
        try {
            await api.delete('/cart');
            set({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart', error);
        }
    }
}));
