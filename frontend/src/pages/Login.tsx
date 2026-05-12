import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '@/lib/auth';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const success = await authService.login(email, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4">
                <div className="w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-500/5 rounded-full blur-3xl opacity-60"></div>
            </div>
            <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4">
                <div className="w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back to Home */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#F5A623] transition-colors mb-8 group">
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="bg-white dark:bg-[#1A1E29] border border-slate-200 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 dark:bg-[#F5A623] rounded-2xl flex items-center justify-center text-white dark:text-[#0D0F14] mb-6 shadow-lg shadow-blue-500/20 dark:shadow-[#F5A623]/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Sign in to your admin dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-[#F5A623] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@voltwavetech.com"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-[#F5A623]/20 focus:border-blue-600 dark:focus:border-[#F5A623] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-[#F5A623] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-[#F5A623]/20 focus:border-blue-600 dark:focus:border-[#F5A623] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-blue-600/20 dark:shadow-[#F5A623]/10 dark:bg-[#F5A623] dark:text-[#0D0F14] dark:hover:bg-[#D48E1D] group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <LogIn size={20} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Forgot your credentials? <span className="text-blue-600 dark:text-[#F5A623] font-bold cursor-pointer hover:underline">Contact System Admin</span>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Secured Access</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
