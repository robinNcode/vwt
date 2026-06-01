import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Search, Eye, CheckCircle, Trash2, Clock, User, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { format } from 'date-fns'
import { authService } from '@/lib/auth'

interface ContactMessage {
    id: number
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    is_read: boolean
    created_at: string
}

const AdminMessages = () => {
    const { t } = useTranslation()
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const token = authService.getToken()
            const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api/v1'
            const response = await axios.get(`${apiBaseURL}/admin/contact-messages`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.data.success) {
                setMessages(response.data.data || [])
            }
        } catch (error) {
            console.error('Fetch messages error:', error)
            toast.error(t('messages.error_fetch'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleMarkAsRead = async (id: number) => {
        try {
            const token = authService.getToken()
            const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api/v1'
            await axios.put(`${apiBaseURL}/admin/contact-messages/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, is_read: true })
            }
            toast.success(t('messages.mark_read_success'))
        } catch (error) {
            console.error('Mark read error:', error)
            toast.error(t('messages.mark_read_error'))
        }
    }

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('messages.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('messages.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Message List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('admin_nav.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-blue-600 dark:focus:border-[#F5A623] outline-none transition-all text-sm"
                        />
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">{t('messages.loading')}</div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">{t('messages.no_found')}</div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex flex-col gap-1 ${selectedMessage?.id === msg.id ? 'bg-blue-50/50 dark:bg-blue-500/5 ring-l-2 ring-blue-600 dark:ring-[#F5A623]' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold ${msg.is_read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                                {msg.name}
                                            </span>
                                            {!msg.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#F5A623]"></span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 truncate">{msg.subject || 'No Subject'}</span>
                                        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock size={12} />
                                            {format(new Date(msg.created_at), 'MMM dd, yyyy HH:mm')}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col h-full min-h-[600px]"
                        >
                            <div className="p-6 border-b border-slate-100 dark:divide-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{selectedMessage.name}</h3>
                                        <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!selectedMessage.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                                            title={t('messages.mark_read')}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    )}
                                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <MessageSquare size={16} />
                                        <span className="text-xs font-semibold uppercase tracking-wider">{t('messages.subject')}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {selectedMessage.subject || 'No Subject'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Mail size={16} />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Message Content</span>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-black/20 p-6 rounded-2xl">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {selectedMessage.phone && (
                                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-8">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Phone</p>
                                            <p className="text-sm dark:text-white font-medium">{selectedMessage.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Received At</p>
                                            <p className="text-sm dark:text-white font-medium">{format(new Date(selectedMessage.created_at), 'PPPP p')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Select a message</h3>
                            <p className="text-sm text-slate-500 max-w-xs">Choose a message from the list to view its contents and take action.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminMessages
