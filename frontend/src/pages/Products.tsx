import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from '../components/ui/Skeleton';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import api from '../lib/axios';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string | null;
}

const Products: React.FC = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Simulate network delay for skeleton visibility
                await new Promise(resolve => setTimeout(resolve, 1500));
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
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t('nav.products')}</h1>
                    <p className="text-slate-600 text-lg">Explore our range of professional electrical components.</p>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                            <div className="relative h-64 overflow-hidden bg-slate-50">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ShoppingCart size={48} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                                    <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
                                        <Heart size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">Category</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-extrabold text-slate-900">${product.price}</span>
                                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-500 text-xl">No products found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;

