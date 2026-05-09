import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/auth';
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await authService.login(email, password, 'admin');
            if (res.success) {
                navigate('/admin/dashboard');
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0D0F14] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F5A623] to-[#FF8C00] shadow-lg shadow-[#F5A623]/20 mb-6 group transition-transform duration-500 hover:rotate-12">
                            <ShieldCheck className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-sora font-extrabold text-white mb-2">Welcome Back</h1>
                        <p className="text-[#8A8FA8]">Admin portal access for Volt Wave Tech</p>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#515672] group-focus-within:text-[#F5A623] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#13161E] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-[#515672] focus:outline-none focus:border-[#F5A623]/50 transition-all font-medium"
                                        placeholder="admin@vwt.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#515672] group-focus-within:text-[#F5A623] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#13161E] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-[#515672] focus:outline-none focus:border-[#F5A623]/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#F5A623] focus:ring-[#F5A623]/50" />
                                    <span className="text-sm text-[#8A8FA8] group-hover:text-white transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-[#F5A623] hover:text-[#D48E1D] font-bold transition-colors">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#F5A623] to-[#FF8C00] hover:shadow-lg hover:shadow-[#F5A623]/30 text-[#0D0F14] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-[#8A8FA8] text-sm">
                        Restricted Access. Unauthorized entry attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

