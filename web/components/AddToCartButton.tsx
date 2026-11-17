'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCartStore } from '@/lib/cart';

type AddToCartButtonProps = {
    productId?: number;
    serviceId?: number;
    product?: unknown;
    service?: unknown;
    label?: string;
    disabled?: boolean;
    className?: string;
};

export default function AddToCartButton({
    productId,
    serviceId,
    product,
    service,
    label = 'Add to Cart',
    disabled = false,
    className = '',
}: AddToCartButtonProps) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [adding, setAdding] = useState(false);

    const handleClick = async () => {
        setAdding(true);

        try {
            await addToCart({
                productId,
                serviceId,
                quantity: 1,
                product,
                service,
            });
            toast.success('Added to cart');
        } catch {
            toast.error('Could not add this item to the cart');
        } finally {
            setAdding(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || adding}
            className={
                className ||
                'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D]'
            }
        >
            <ShoppingCart size={18} />
            {adding ? 'Adding...' : label}
        </button>
    );
}
