import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/ui/Skeleton';
import { ShoppingCart, Heart, Eye, Search, SlidersHorizontal, X, Package, LayoutGrid } from 'lucide-react';
import api from '../lib/axios';
import { useCartStore } from '../lib/cart';
import { getMediaUrl, getThumbnailUrl } from '../lib/media';
import ProductModal from '../components/products/ProductModal';
import { useSearchParams } from 'react-router-dom';

export interface ProductImage {
    id?: number;
    url: string;
    thumbnail_url?: string;
    thumb?: string;
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

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' },
    }),
};

const Products: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
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

    useEffect(() => {
        const nextSearch = searchParams.get('search') || '';
        const nextCategory = searchParams.get('category') || 'all';
        const nextMin = searchParams.get('minPrice') || '';
        const nextMax = searchParams.get('maxPrice') || '';
        const nextSort = searchParams.get('sortBy') || 'featured';

        setSearchTerm(nextSearch);
        setSelectedCategory(nextCategory);
        setMinPrice(nextMin);
        setMaxPrice(nextMax);
        setSortBy(nextSort);
    }, [searchParams]);

    const categories = useMemo(() => {
        const seen = new Map<string, string>();
        products.forEach((product) => {
            const label = i18n.language === 'bn'
                ? product.category?.name_bn || product.brand || 'পণ্য'
                : product.category?.name_en || product.brand || 'Product';
            const key = (product.category?.name_en || product.brand || 'product').toLowerCase();
            if (!seen.has(key)) {
                seen.set(key, label);
            }
        });
        return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
    }, [products, i18n.language]);

    const filteredProducts = useMemo(() => {
        const min = minPrice ? Number(minPrice) : null;
        const max = maxPrice ? Number(maxPrice) : null;
        const term = searchTerm.trim().toLowerCase();

        const filtered = products.filter((product) => {
            const categoryKey = (product.category?.name_en || product.brand || 'product').toLowerCase();
            const price = Number(product.price || 0);
            const text = [
                product.name_en,
                product.name_bn,
                product.short_desc_en,
                product.short_desc_bn,
                product.description_en,
                product.description_bn,
                product.brand,
                product.sku,
                product.category?.name_en,
                product.category?.name_bn,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            if (term && !text.includes(term)) return false;
            if (selectedCategory !== 'all' && categoryKey !== selectedCategory) return false;
            if (min !== null && price < min) return false;
            if (max !== null && price > max) return false;
            return true;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name_en.localeCompare(b.name_en);
                case 'name-desc':
                    return b.name_en.localeCompare(a.name_en);
                case 'newest':
                    return b.id - a.id;
                case 'featured':
                default:
                    return Number(b.images?.[0]?.is_primary || 0) - Number(a.images?.[0]?.is_primary || 0) || b.id - a.id;
            }
        });
    }, [products, searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

    const applyQuery = () => {
        const next = new URLSearchParams();
        if (searchTerm.trim()) next.set('search', searchTerm.trim());
        if (selectedCategory !== 'all') next.set('category', selectedCategory);
        if (minPrice.trim()) next.set('minPrice', minPrice.trim());
        if (maxPrice.trim()) next.set('maxPrice', maxPrice.trim());
        if (sortBy !== 'featured') next.set('sortBy', sortBy);
        setSearchParams(next, { replace: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('featured');
        setSearchParams({}, { replace: true });
    };

    const getProductName = (p: Product) => i18n.language === 'bn' ? p.name_bn : p.name_en;
    const getProductDesc = (p: Product) =>
        i18n.language === 'bn' ? (p.short_desc_bn || p.short_desc_en || '') : (p.short_desc_en || p.short_desc_bn || '');
    const getPrimaryImage = (p: Product) => {
        if (!p.images || p.images.length === 0) return null;
        return p.images.find(img => img.is_primary) || p.images[0];
    };

    const hasActiveFilters =
        searchTerm.trim() !== '' ||
        selectedCategory !== 'all' ||
        minPrice.trim() !== '' ||
        maxPrice.trim() !== '' ||
        sortBy !== 'featured';

    const ProductSkeleton = () => (
        <div className="bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
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
        <>
            {/* ── Page Hero ── */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                {/* Radial glow */}
                <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0}
                        className="flex items-center gap-2 mb-5"
                    >
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                            <LayoutGrid size={12} />
                            Catalog
                        </span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={1}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
                    >
                        {t('nav.products')}
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={2}
                        className="text-white/75 text-lg md:text-xl max-w-2xl mb-8"
                    >
                        Explore AirTAC pneumatics, boiler spares, and industrial equipment.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={3}
                        className="flex flex-wrap items-center gap-3"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                            <SlidersHorizontal size={14} />
                            {loading ? '—' : filteredProducts.length} results
                        </span>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-400/30 px-4 py-1.5 text-sm font-bold text-red-300 hover:bg-red-500/30 transition-colors"
                            >
                                <X size={13} />
                                Clear filters
                            </button>
                        )}
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-sm font-bold text-white/70 backdrop-blur-sm">
                            Global catalog search
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ── Sticky Filter Bar ── */}
            <div className="sticky top-[73px] z-40 bg-white/95 dark:bg-[#0D0F14]/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 shadow-sm">
                <div className="container-custom py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        {/* Search */}
                        <div className="lg:col-span-4 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyQuery()}
                                placeholder="Search products, brands, or SKUs"
                                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 pl-11 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>

                        {/* Category */}
                        <div className="lg:col-span-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            >
                                <option value="all">All categories</option>
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Min price */}
                        <div className="lg:col-span-2">
                            <input
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                type="number"
                                min="0"
                                placeholder="Min price"
                                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>

                        {/* Max price */}
                        <div className="lg:col-span-2">
                            <input
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                type="number"
                                min="0"
                                placeholder="Max price"
                                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>

                        {/* Go */}
                        <div className="lg:col-span-1">
                            <button
                                onClick={applyQuery}
                                className="w-full rounded-2xl bg-blue-600 py-2.5 px-4 font-bold text-white transition-colors hover:bg-blue-700 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D] text-sm"
                            >
                                Go
                            </button>
                        </div>

                        {/* Sort + Clear row */}
                        <div className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="newest">Sort: Newest</option>
                                <option value="price-asc">Price low to high</option>
                                <option value="price-desc">Price high to low</option>
                                <option value="name-asc">Name A to Z</option>
                                <option value="name-desc">Name Z to A</option>
                            </select>
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={15} />
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Product Grid ── */}
            <div className="bg-white dark:bg-[#0D0F14]">
                <div className="container-custom py-12">
                    {/* Eyebrow label */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 flex items-center gap-3"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-1.5 text-sm font-bold text-blue-600 dark:text-[#F5A623]">
                                <Package size={14} />
                                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                            </span>
                            {hasActiveFilters && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    Filtered from {products.length} total
                                </span>
                            )}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product, idx) => {
                                const primaryImage = getPrimaryImage(product);
                                const name = getProductName(product);
                                return (
                                    <motion.div
                                        key={product.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        custom={idx % 8}
                                        className="group bg-white dark:bg-[#1A1E29] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-slate-50 dark:bg-black/20">
                                            {primaryImage ? (
                                                <img
                                                    src={getThumbnailUrl(primaryImage)}
                                                    alt={name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/[0.02]">
                                                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center border border-slate-100 dark:border-white/10">
                                                        <Package size={36} strokeWidth={1.2} className="text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No Image</span>
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
                                                    onClick={() => addToCart({ productId: product.id, quantity: 1, product })}
                                                    className="bg-slate-900 dark:bg-[#F5A623] text-white dark:text-[#0D0F14] px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 dark:hover:bg-[#D48E1D] transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="col-span-full py-24 flex flex-col items-center justify-center gap-5 text-center"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                                        <Package size={48} strokeWidth={1} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">No products found</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                                            Try adjusting your search term, category, or price range.
                                        </p>
                                    </div>
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 dark:bg-[#F5A623] px-5 py-2.5 text-sm font-bold text-white dark:text-[#0D0F14] hover:bg-blue-700 dark:hover:bg-[#D48E1D] transition-colors"
                                    >
                                        <X size={14} />
                                        Reset filters
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
};

export default Products;
