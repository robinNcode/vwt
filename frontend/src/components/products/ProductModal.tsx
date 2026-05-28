import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Zap, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useCartStore } from '../../lib/cart';
import { cn } from '../../lib/utils';
import type { Product } from '../../pages/Products';
import { useTranslation } from 'react-i18next';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const { i18n } = useTranslation();
    const addToCart = useCartStore((state) => state.addToCart);
    const [activeImg, setActiveImg] = useState(0);
    const [adding, setAdding] = useState(false);

    if (!product) return null;

    const images = product.images || [];
    const name = i18n.language === 'bn' ? product.name_bn : product.name_en;
    const desc = i18n.language === 'bn'
        ? (product.description_bn || product.short_desc_bn || product.description_en || product.short_desc_en || '')
        : (product.description_en || product.short_desc_en || product.description_bn || product.short_desc_bn || '');

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await addToCart({ productId: product.id, quantity: 1 });
            onClose();
        } catch {

            // error handled in store
        } finally {
            setAdding(false);
        }
    };

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
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/20 dark:text-slate-400 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-black/20 flex flex-col min-h-[360px] relative">
                            {/* Main Image */}
                            <div className="flex-1 flex items-center justify-center p-8">
                                {images.length > 0 ? (
                                    <img
                                        key={activeImg}
                                        src={`${import.meta.env.VITE_SERVER_URL}${images[activeImg]?.url}`}
                                        alt={name}
                                        className="max-w-full max-h-[300px] object-contain drop-shadow-2xl transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-3">
                                        <Package size={64} strokeWidth={1} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Industrial Asset</span>
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails / Carousel dots */}
                            {images.length > 1 && (
                                <div className="pb-4 px-4 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setActiveImg(i => Math.max(0, i - 1))}
                                        disabled={activeImg === 0}
                                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div className="flex gap-2">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImg(i)}
                                                className={cn(
                                                    "w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                                                    i === activeImg
                                                        ? "border-blue-600 dark:border-[#F5A623] scale-110 shadow-md"
                                                        : "border-transparent opacity-60 hover:opacity-100"
                                                )}
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_SERVER_URL}${img.url}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveImg(i => Math.min(images.length - 1, i + 1))}
                                        disabled={activeImg === images.length - 1}
                                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-4 w-max">
                                    <Zap size={12} />
                                    <span>{product.brand || 'Premium Component'}</span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight">
                                    {name}
                                </h2>

                                {product.sku && (
                                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-4">SKU: {product.sku}</p>
                                )}

                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    {desc || "High-quality industrial component designed for professional use and rigorous applications."}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Price</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                                            ৳{product.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="bg-blue-600 dark:bg-[#F5A623] hover:bg-blue-700 dark:hover:bg-[#D48E1D] text-white dark:text-[#0D0F14] px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart size={18} />
                                        {adding ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
