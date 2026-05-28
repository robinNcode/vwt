import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, Package, Wrench } from 'lucide-react';
import { useCartStore } from '../../lib/cart';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC = () => {
    const { i18n } = useTranslation();
    const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart } = useCartStore();

    const total = items.reduce((sum, item) => {
        const price = item.product?.price ?? item.service?.price ?? 0;
        return sum + price * item.quantity;
    }, 0);

    const getItemName = (item: any) => {
        const entity = item.product || item.service;
        if (!entity) return 'Item';
        return i18n.language === 'bn' ? (entity.name_bn || entity.name_en) : (entity.name_en || entity.name_bn);
    };

    const getItemImage = (item: any): string | null => {
        if (item.product) {
            const images = item.product.images || [];
            const primary = images.find((img: any) => img.is_primary) || images[0];
            return primary?.url || null;
        }
        return item.service?.image_url || null;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white dark:bg-[#0D0F14] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingCart size={20} className="text-blue-600 dark:text-[#F5A623]" />
                                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Your Cart</h2>
                                {items.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] text-xs font-bold">
                                        {items.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400 py-16">
                                    <Package size={56} strokeWidth={1} />
                                    <div className="text-center">
                                        <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">Your cart is empty</p>
                                        <p className="text-sm text-slate-400">Add some products or services to get started</p>
                                    </div>
                                    <Link
                                        to="/products"
                                        onClick={() => setIsOpen(false)}
                                        className="mt-2 px-6 py-2.5 bg-blue-600 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] rounded-xl font-bold text-sm hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-colors"
                                    >
                                        Browse Items
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const imgUrl = getItemImage(item);
                                    const name = getItemName(item);
                                    const price = item.product?.price ?? item.service?.price ?? 0;
                                    return (
                                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                                            {/* Image */}
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-black/20 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5">
                                                {imgUrl ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_SERVER_URL}${imgUrl}`}
                                                        alt={name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    item.service_id ? <Wrench size={20} className="text-slate-300 dark:text-slate-700" strokeWidth={1} /> : <Package size={20} className="text-slate-300 dark:text-slate-700" strokeWidth={1} />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{name}</p>
                                                <p className="text-xs text-blue-600 dark:text-[#F5A623] font-bold">
                                                    ৳{(price * item.quantity).toLocaleString()}
                                                </p>
                                                {item.service_id && (
                                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Service</span>
                                                )}
                                            </div>


                                            {/* Qty Controls */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 text-slate-500 transition-all border border-slate-100 dark:border-white/5"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 text-slate-500 transition-all border border-slate-100 dark:border-white/5"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ml-1 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Subtotal</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white">৳{total.toLocaleString()}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-[#F5A623] hover:bg-blue-700 dark:hover:bg-[#D48E1D] text-white dark:text-[#0D0F14] py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 dark:shadow-[#F5A623]/10 active:scale-95"
                                >
                                    Proceed to Checkout
                                </Link>
                                <button
                                    onClick={() => clearCart()}
                                    className="w-full text-center text-xs text-slate-400 hover:text-red-500 transition-colors font-medium py-1"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
