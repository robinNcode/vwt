import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Lock, Package, ShoppingCart, UserPlus } from 'lucide-react';
import api from '@/lib/axios';
import { authService } from '@/lib/auth';
import { useCartStore, type CartItem } from '@/lib/cart';
import { getMediaUrl } from '@/lib/media';

const getItemEntity = (item: CartItem) => item.product || item.service;

const getItemName = (item: CartItem) => {
    const entity = getItemEntity(item);
    return entity?.name_en || entity?.name_bn || (item.service_id ? 'Service' : 'Product');
};

const getItemPrice = (item: CartItem) => Number(item.product?.price ?? item.service?.price ?? 0);

const getItemImage = (item: CartItem) => {
    if (item.product) {
        const images = item.product.images || [];
        const primary = images.find((img: any) => img.is_primary) || images[0];
        return primary?.url || null;
    }
    return item.service?.image_url || null;
};

const buildOrderItem = (item: CartItem) => {
    const name = getItemName(item);
    const unitPrice = getItemPrice(item);
    const sku = item.product?.sku || (item.service_id ? `SVC-${item.service_id}` : `ITEM-${item.id}`);

    return {
        variant_id: null,
        product_name_bn: item.product?.name_bn || item.service?.name_bn || name,
        product_name_en: item.product?.name_en || item.service?.name_en || name,
        sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        line_total: unitPrice * item.quantity,
    };
};

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();
    const { items, clearCart } = useCartStore();
    const [placing, setPlacing] = useState(false);
    const [creatingAccount, setCreatingAccount] = useState(false);
    const [error, setError] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [createAccount, setCreateAccount] = useState(false);
    const [password, setPassword] = useState('');
    const [form, setForm] = useState({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        ship_address_line1: '',
        ship_address_line2: '',
        ship_city: 'Dhaka',
        ship_district: '',
        ship_postal_code: '',
        notes: '',
    });

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0),
        [items]
    );

    const updateForm = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        setError('');
        setPlacing(true);

        try {
            if (!user && createAccount) {
                if (password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    return;
                }
                setCreatingAccount(true);
                await authService.registerCustomer({
                    name: form.customer_name,
                    email: form.customer_email,
                    phone: form.customer_phone,
                    password,
                });
                setCreatingAccount(false);
            }

            const payload = {
                customer_name: form.customer_name,
                customer_email: form.customer_email,
                customer_phone: form.customer_phone,
                ship_address_line1: form.ship_address_line1,
                ship_address_line2: form.ship_address_line2 || null,
                ship_city: form.ship_city,
                ship_district: form.ship_district || null,
                ship_postal_code: form.ship_postal_code || null,
                ship_country: 'BD',
                currency_code: 'BDT',
                subtotal,
                grand_total: subtotal,
                notes: form.notes || null,
                items: items.map(buildOrderItem),
            };

            const res = await api.post('/orders', payload);
            if (!res.data.success) {
                throw new Error(res.data.message || 'Failed to place order.');
            }

            setOrderNumber(res.data.data.order_number);
            await clearCart();
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Failed to place order. Please try again.');
        } finally {
            setCreatingAccount(false);
            setPlacing(false);
        }
    };

    if (orderNumber) {
        return (
            <div className="container-custom pt-32 pb-20">
                <div className="max-w-2xl mx-auto bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-3xl p-8 text-center shadow-xl">
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-5" size={64} />
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Order placed successfully</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Keep this order number for tracking.</p>
                    <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-5 py-4 font-mono font-bold text-blue-600 dark:text-[#F5A623] mb-6">
                        {orderNumber}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/products" className="btn-secondary px-6 py-3 rounded-xl">Continue Shopping</Link>
                        <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 rounded-xl">Back Home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom pt-32 pb-20">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <form onSubmit={handlePlaceOrder} className="w-full lg:flex-1 bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Checkout</h1>
                        <p className="text-slate-500 dark:text-slate-400">Products and services can be checked out together in one order.</p>
                    </div>

                    {!user && (
                        <div className="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-5">
                            <div className="flex gap-3">
                                <UserPlus className="text-blue-600 dark:text-[#F5A623] shrink-0" size={22} />
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">Walk-in checkout is available</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                        Register or log in for a better experience, saved details, and easier order tracking later.
                                    </p>
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                                            <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                                            Create account with this order
                                        </label>
                                        <Link to="/login" className="text-sm font-bold text-blue-600 dark:text-[#F5A623] hover:underline">Already registered? Log in</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={form.customer_name} onChange={(e) => updateForm('customer_name', e.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input required type="email" value={form.customer_email} onChange={(e) => updateForm('customer_email', e.target.value)} placeholder="Email address" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input required value={form.customer_phone} onChange={(e) => updateForm('customer_phone', e.target.value)} placeholder="Phone number" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        {createAccount && !user && (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Account password" className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] pl-10 pr-4 py-3 outline-none" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={form.ship_address_line1} onChange={(e) => updateForm('ship_address_line1', e.target.value)} placeholder="Address line 1" className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input value={form.ship_address_line2} onChange={(e) => updateForm('ship_address_line2', e.target.value)} placeholder="Address line 2" className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input required value={form.ship_city} onChange={(e) => updateForm('ship_city', e.target.value)} placeholder="City" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input value={form.ship_district} onChange={(e) => updateForm('ship_district', e.target.value)} placeholder="District" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                        <input value={form.ship_postal_code} onChange={(e) => updateForm('ship_postal_code', e.target.value)} placeholder="Postal code" className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />
                    </div>

                    <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Order notes" rows={3} className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F14] px-4 py-3 outline-none" />

                    <button disabled={placing || items.length === 0} className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                        {placing ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                        {creatingAccount ? 'Creating account...' : placing ? 'Placing order...' : 'Place Order'}
                    </button>
                </form>

                <aside className="w-full lg:w-[380px] bg-white dark:bg-[#1A1E29] border border-slate-100 dark:border-white/5 rounded-3xl p-6 shadow-xl sticky top-28">
                    <h2 className="font-bold text-slate-900 dark:text-white mb-5">Order Summary</h2>
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <Package className="mx-auto mb-3" size={42} />
                            <p className="font-bold">Your cart is empty</p>
                            <Link to="/products" className="text-blue-600 dark:text-[#F5A623] text-sm font-bold hover:underline">Browse products</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const img = getItemImage(item);
                                const lineTotal = getItemPrice(item) * item.quantity;
                                return (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center">
                                            {img ? <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" /> : <Package size={20} className="text-slate-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{getItemName(item)}</p>
                                            <p className="text-xs text-slate-400">{item.service_id ? 'Service' : 'Product'} x {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">৳{lineTotal.toLocaleString()}</p>
                                    </div>
                                );
                            })}
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Total</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">৳{subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
