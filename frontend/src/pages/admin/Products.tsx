import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    MoreHorizontal,
    Image as ImageIcon,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Upload,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { getMediaUrl } from '@/lib/media';

interface ProductImage {
    url: string;
}

interface Product {
    id: number;
    category_id: number;
    product_type: string;
    name_bn: string;
    name_en: string;
    slug: string;
    sku: string;
    price: number;
    stock: number;
    short_desc_en?: string;
    short_desc_bn?: string;
    description_en?: string;
    description_bn?: string;
    brand?: string;
    model_number?: string;
    manufacturer?: string;
    is_active: boolean;
    is_featured: boolean;
    images?: ProductImage[];
}

const Products: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        category_id: 1,
        product_type: 'accessory',
        name_bn: '',
        name_en: '',
        slug: '',
        sku: '',
        price: 0,
        stock: 0,
        brand: '',
        model_number: '',
        manufacturer: '',
        is_active: true,
        is_featured: false,
        short_desc_en: '',
        short_desc_bn: '',
        description_en: '',
        description_bn: ''
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/products?search=${searchTerm}&page=${currentPage}`);
            if (res.data.success) {
                if (res.data.data.items) {
                    setProducts(res.data.data.items);
                    setTotalPages(res.data.data.totalPages || 1);
                    setTotalItems(res.data.data.totalItems || 0);
                } else {
                    setProducts(res.data.data);
                    setTotalPages(1);
                    setTotalItems(res.data.data.length);
                }
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingProduct
            ? `/admin/products/${editingProduct.id}`
            : '/admin/products';
        const method = editingProduct ? 'put' : 'post';

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, String(value));
        });
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            const res = await api({
                method,
                url,
                data,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                resetForm();
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({
            category_id: 1,
            product_type: 'accessory',
            name_bn: '',
            name_en: '',
            slug: '',
            sku: '',
            price: 0,
            stock: 0,
            brand: '',
            model_number: '',
            manufacturer: '',
            is_active: true,
            is_featured: false,
            short_desc_en: '',
            short_desc_bn: '',
            description_en: '',
            description_bn: ''
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await api.delete(`/admin/products/${id}`);
            if (res.data.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            category_id: product.category_id || 1,
            product_type: product.product_type,
            name_bn: product.name_bn,
            name_en: product.name_en,
            slug: product.slug,
            sku: product.sku || '',
            price: product.price || 0,
            stock: product.stock || 0,
            brand: product.brand || '',
            model_number: product.model_number || '',
            manufacturer: product.manufacturer || '',
            is_active: product.is_active,
            is_featured: product.is_featured,
            short_desc_en: product.short_desc_en || '',
            short_desc_bn: product.short_desc_bn || '',
            description_en: product.description_en || '',
            description_bn: product.description_bn || ''
        });
        setPreviewUrl(product.images?.[0]?.url ? getMediaUrl(product.images[0].url) : null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">{t('admin_nav.products')}</h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#8A8FA8] mt-1">Manage your catalog, stock, and pricing models.</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    className="bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#4D526A]" size={18} />
                    <input
                        type="text"
                        placeholder={t('admin_nav.search_placeholder')}
                        className="bg-white dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]/50 w-full transition-all text-[#5C4D3C] dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Product Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">SKU & Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Featured</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin text-[#F5A623] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center text-[#d48e1d] overflow-hidden border border-[#F5A623]/20">
                                                {product.images?.length ? (
                                                    <img src={getMediaUrl(product.images[0].url)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{i18n.language === 'en' ? product.name_en : product.name_bn}</p>
                                                <p className="text-[10px] text-[#8B7355] dark:text-[#4D526A] uppercase font-bold tracking-tight">{product.brand || 'No Brand'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono font-bold text-[#F5A623]">{product.sku}</p>
                                            <p className="text-xs font-bold text-[#5C4D3C] dark:text-[#8A8FA8]">৳ {product.price}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                            product.is_active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                        )}>
                                            <div className={cn("w-1 h-1 rounded-full", product.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                            {product.is_active ? 'Active' : 'Hidden'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {product.is_featured ? <Check className="text-emerald-500 mx-auto" size={18} /> : <X className="text-[#8B7355] dark:text-[#4D526A] mx-auto" size={18} />}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-xs font-bold",
                                            product.stock > 10 ? "text-slate-500" : "text-amber-500"
                                        )}>
                                            {product.stock} pcs
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(product)} className="p-2 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-all text-[#8B7355] dark:text-[#4D526A]">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-[#8B7355] dark:text-[#4D526A]">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={setCurrentPage} />
            </div>

            {/* Upsert Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="fixed inset-0 bg-[#0D0F14]/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1A1E29] border border-white/5 w-full max-w-4xl rounded-3xl overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-sora font-extrabold text-xl text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={resetForm} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                                        {previewUrl ? (
                                            <div className="relative w-full h-48 flex items-center justify-center">
                                                <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl" />
                                                <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center group">
                                                <div className="w-16 h-16 rounded-2xl bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623] mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-white">Click to Upload Industrial View</p>
                                                <p className="text-[10px] text-[#4D526A] mt-1 uppercase tracking-widest font-bold">Max size: 5MB (PNG, JPG)</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Name (English)</label>
                                        <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                            value={formData.name_en} onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({ ...formData, name_en: val, slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') });
                                            }} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Name (Bengali)</label>
                                        <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                            value={formData.name_bn} onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Price (BDT)</label>
                                            <input required type="number" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                                value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Stock Qty</label>
                                            <input required type="number" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                                value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">SKU Code</label>
                                            <input required type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-[#F5A623] font-mono"
                                                value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Brand</label>
                                            <input type="text" className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white"
                                                value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Short Description (EN)</label>
                                        <textarea className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white min-h-[100px]"
                                            value={formData.short_desc_en} onChange={(e) => setFormData({ ...formData, short_desc_en: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Short Description (BN)</label>
                                        <textarea className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#F5A623]/50 text-white min-h-[100px]"
                                            value={formData.short_desc_bn} onChange={(e) => setFormData({ ...formData, short_desc_bn: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 py-4 border-t border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn("w-12 h-6 rounded-full transition-all relative", formData.is_active ? "bg-[#F5A623]" : "bg-[#4D526A]")}>
                                            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", formData.is_active ? "right-1" : "left-1")} />
                                        </div>
                                        <span className="text-sm font-bold text-white">Active Catalog Status</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                            className={cn("w-12 h-6 rounded-full transition-all relative", formData.is_featured ? "bg-[#F5A623]" : "bg-[#4D526A]")}>
                                            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", formData.is_featured ? "right-1" : "left-1")} />
                                        </div>
                                        <span className="text-sm font-bold text-white">Featured Promo</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button type="button" onClick={resetForm} className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-[#8A8FA8] hover:bg-white/10 transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20">
                                        {editingProduct ? 'Update Industrial Asset' : 'Register New Asset'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
