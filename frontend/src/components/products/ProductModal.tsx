import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Zap } from 'lucide-react';
import { useCartStore } from '../../lib/cart';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string | null;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const addToCart = useCartStore((state) => state.addToCart);

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl bg-white dark:bg-[#0D0F14] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-slate-400 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-black/20 flex items-center justify-center min-h-[300px] p-8">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-xl"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                    <ShoppingCart size={64} strokeWidth={1} />
                                    <span className="mt-4 text-sm font-medium">No Image Available</span>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 w-max">
                                <Zap size={14} />
                                <span>Premium Component</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                                {product.name}
                            </h2>

                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 flex-1">
                                {product.description || "High-quality industrial component designed for professional use and rigorous applications. Exact specifications available in user manual."}
                            </p>

                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <span className="block text-sm font-bold text-slate-400 mb-1">Price</span>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white flex items-start gap-1">
                                        <span className="text-2xl mt-1">$</span>
                                        {product.price}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(product.id, 1);
                                        onClose();
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
