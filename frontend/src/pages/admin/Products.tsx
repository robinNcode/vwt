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
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';

interface Product {
    id: number;
    category_id: number;
    product_type: string;
    name_bn: string;
    name_en: string;
    slug: string;
    is_active: boolean;
    is_featured: boolean;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        category_id: 1,
        product_type: 'accessory',
        name_bn: '',
        name_en: '',
        slug: '',
        is_active: true,
        is_featured: false
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8083/api/v1/products?search=${searchTerm}&page=${currentPage}`);
            const data = await res.json();
            if (data.success) {
                if (data.data.items) {
                    setProducts(data.data.items);
                    setTotalPages(data.data.totalPages || 1);
                    setTotalItems(data.data.totalItems || 0);
                } else {
                    setProducts(data.data);
                    setTotalPages(1);
                    setTotalItems(data.data.length);
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

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingProduct
            ? `http://localhost:8083/api/v1/products/${editingProduct.id}`
            : 'http://localhost:8083/api/v1/products';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({
                    category_id: 1,
                    product_type: 'accessory',
                    name_bn: '',
                    name_en: '',
                    slug: '',
                    is_active: true,
                    is_featured: false
                });
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`http://localhost:8083/api/v1/products/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            category_id: product.category_id,
            product_type: product.product_type,
            name_bn: product.name_bn,
            name_en: product.name_en,
            slug: product.slug,
            is_active: product.is_active,
            is_featured: product.is_featured
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-sora text-2xl font-extrabold text-[#5C4D3C] dark:text-white">Product Management</h1>
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
                        placeholder="Search products..."
                        className="bg-white dark:bg-[#13161E] border border-[#E8DCC4] dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]/50 w-full transition-all text-[#5C4D3C] dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E8DCC4] dark:border-white/5 text-sm font-semibold text-[#8B7355] dark:text-[#8A8FA8] hover:bg-[#F8F3E6] dark:hover:bg-white/10 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E8DCC4] dark:border-white/5 text-sm font-semibold text-[#8B7355] dark:text-[#8A8FA8] hover:bg-[#F8F3E6] dark:hover:bg-white/10 transition-all">
                        Sort
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#FDFBF7] dark:bg-[#1A1E29] border border-[#E8DCC4] dark:border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-[#F5A623]/10 dark:shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F3E6] dark:bg-[#13161E]/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Product Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Featured</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#8B7355] dark:text-[#4D526A] uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC4] dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-[#F5A623]" size={32} />
                                            <p className="text-sm text-[#4D526A]">Loading products...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355] dark:text-[#4D526A]">No products found.</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-[#F8F3E6]/60 dark:hover:bg-white/[0.02] transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 dark:bg-white/5 flex items-center justify-center text-[#d48e1d] dark:text-[#4D526A] group-hover:text-[#F5A623] transition-all overflow-hidden">
                                                <ImageIcon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#5C4D3C] dark:text-[#F0F2F7]">{product.name_en}</p>
                                                <p className="text-xs text-[#8B7355] dark:text-[#4D526A] mt-0.5">{product.name_bn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase tracking-tight">
                                            {product.product_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", product.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                            <span className="text-xs font-semibold text-[#8A8FA8]">{product.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {product.is_featured ? <Check className="text-emerald-500 mx-auto" size={18} /> : <X className="text-[#8B7355] dark:text-[#4D526A] mx-auto" size={18} />}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-[#8B7355] dark:text-[#4D526A]">May 09, 2026</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all text-[#8B7355] dark:text-[#4D526A]"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-[#8B7355] dark:text-[#4D526A]"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Upsert Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0D0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#1A1E29] border border-white/5 w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-sora font-extrabold text-xl text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpsert} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Name (English)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            placeholder="e.g. Copper Wire 1.5mm"
                                            value={formData.name_en}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    name_en: val,
                                                    slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Name (Bengali)</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all"
                                            placeholder="উদা: কপার ওয়্যার ১.৫মিমি"
                                            value={formData.name_bn}
                                            onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Product Slug</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#13161E] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-[#F5A623] transition-all font-mono"
                                            placeholder="copper-wire-15"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider">Product Type</label>
                                        <select
                                            className="w-full bg-[#13161E] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5A623]/50 text-white transition-all appearance-none"
                                            value={formData.product_type}
                                            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                                        >
                                            <option value="accessory">Accessory</option>
                                            <option value="equipment">Equipment</option>
                                            <option value="part">Spare Part</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 py-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                formData.is_active ? "bg-[#F5A623]" : "bg-[#4D526A]"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                                formData.is_active ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-[#F0F2F7]">Active in Catalog</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                formData.is_featured ? "bg-[#F5A623]" : "bg-[#4D526A]"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                                formData.is_featured ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-[#F0F2F7]">Featured Product</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-[#8A8FA8] hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#D48E1D] text-[#0D0F14] text-sm font-bold transition-all shadow-lg shadow-[#F5A623]/20"
                                    >
                                        {editingProduct ? 'Update Product' : 'Create Product'}
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
