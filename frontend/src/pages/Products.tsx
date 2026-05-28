import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/ui/Skeleton';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import api from '../lib/axios';
import { useCartStore } from '../lib/cart';
import ProductModal from '../components/products/ProductModal';

export interface ProductImage {
    id?: number;
    url: string;
    is_primary: boolean;
    sort_order?: number;
}

export interface Product {
    id: number;
    name_en: string;
    name_bn: string;
    price: number;
    short_desc_en?: string;
    short_desc_bn?: string;
    description_en?: string;
    description_bn?: string;
    brand?: string;
    sku?: string;
    images?: ProductImage[];
    category?: { name_en: string; name_bn: string };
}

const Products: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getProductName = (p: Product) => i18n.language === 'bn' ? p.name_bn : p.name_en;
    const getProductDesc = (p: Product) =>
        i18n.language === 'bn' ? (p.short_desc_bn || p.short_desc_en || '') : (p.short_desc_en || p.short_desc_bn || '');
    const getPrimaryImage = (p: Product) => {
        if (!p.images || p.images.length === 0) return null;
        return p.images.find(img => img.is_primary) || p.images[0];
    };

    const ProductSkeleton = () => (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/4" variant="text" />
                <Skeleton className="h-6 w-3/4" variant="text" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-1/3" variant="text" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-custom pt-32 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">{t('nav.products')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Explore our range of professional electrical components.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map((product) => {
                        const primaryImage = getPrimaryImage(product);
                        const name = getProductName(product);
                        return (
                            <div key={product.id} className="group bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-black/30 transition-all duration-500">
                                <div className="relative h-64 overflow-hidden bg-slate-50 dark:bg-black/20">
                                    {primaryImage ? (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${primaryImage.url}`}
                                            alt={name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                <ShoppingCart size={32} strokeWidth={1} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                                        <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1E29] shadow-md flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white transition-all">
                                            <Heart size={18} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedProduct(product)}
                                            className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1E29] shadow-md flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-[#F5A623] hover:text-white transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                    {product.images && product.images.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {product.images.map((_, i) => (
                                                <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-[#F5A623] uppercase tracking-widest mb-2 block">
                                        {product.category ? (i18n.language === 'bn' ? product.category.name_bn : product.category.name_en) : product.brand || 'Electrical'}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate">{name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳{product.price.toLocaleString()}</span>
                                        <button
                                            onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                                            className="bg-slate-900 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 dark:hover:bg-[#D48E1D] transition-colors"
                                        >

                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-500 text-xl">No products found.</p>
                    </div>
                )}
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};

export default Products;
