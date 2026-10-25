import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SiteSettingsProvider } from './lib/settings'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Services from './pages/Services'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import FAQ from './pages/FAQ'
import ShippingPolicy from './pages/ShippingPolicy'
import ReturnPolicy from './pages/ReturnPolicy'

import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminServices from './pages/admin/Services'
import AdminOrders from './pages/admin/Orders'
import AdminInvoices from './pages/admin/Invoices'
import AdminQuotations from './pages/admin/Quotations'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import AdminSales from './pages/admin/Sales'
import AdminPurchases from './pages/admin/Purchases'
import AdminExpenses from './pages/admin/Expenses'
import AdminServiceRevenues from './pages/admin/ServiceRevenues'
import AdminUsers from './pages/admin/Users'
import AdminMessages from './pages/admin/Messages'
import AdminProfile from './pages/admin/Profile'

function App() {
    return (
        <SiteSettingsProvider>
            <Router>
                <Toaster position="top-right" toastOptions={{ className: 'dark:bg-[#1A1E29] dark:text-white' }} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300 selection:bg-blue-100 selection:text-blue-900">
                            <Navbar />
                            <main><Home /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/products" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><Products /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/services" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><Services /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/about" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><About /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/contact" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><Contact /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/checkout" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><Checkout /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/login" element={
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 transition-colors duration-300">
                            <main><Login /></main>
                        </div>
                    } />
                    <Route path="/track-order" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><TrackOrder /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/faq" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><FAQ /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/shipping" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><ShippingPolicy /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/returns" element={
                        <div className="min-h-screen bg-white dark:bg-[#0D0F14] font-sans text-slate-900 dark:text-white transition-colors duration-300">
                            <Navbar />
                            <main><ReturnPolicy /></main>
                            <Footer />
                        </div>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout children={<AdminDashboard />} />} />
                    <Route path="/admin/dashboard" element={<AdminLayout children={<AdminDashboard />} />} />
                    <Route path="/admin/products" element={<AdminLayout children={<AdminProducts />} />} />
                    <Route path="/admin/services" element={<AdminLayout children={<AdminServices />} />} />
                    <Route path="/admin/orders" element={<AdminLayout children={<AdminOrders />} />} />
                    <Route path="/admin/invoices" element={<AdminLayout children={<AdminInvoices />} />} />
                    <Route path="/admin/quotations" element={<AdminLayout children={<AdminQuotations />} />} />
                    <Route path="/admin/reports" element={<AdminLayout children={<AdminReports />} />} />
                    <Route path="/admin/settings" element={<AdminLayout children={<AdminSettings />} />} />
                    <Route path="/admin/accounting/sales" element={<AdminLayout children={<AdminSales />} />} />
                    <Route path="/admin/accounting/purchases" element={<AdminLayout children={<AdminPurchases />} />} />
                    <Route path="/admin/accounting/expenses" element={<AdminLayout children={<AdminExpenses />} />} />
                    <Route path="/admin/accounting/service-revenues" element={<AdminLayout children={<AdminServiceRevenues />} />} />
                    <Route path="/admin/users" element={<AdminLayout children={<AdminUsers />} />} />
                    <Route path="/admin/messages" element={<AdminLayout children={<AdminMessages />} />} />
                    <Route path="/admin/profile" element={<AdminLayout children={<AdminProfile />} />} />
                </Routes>
            </Router>
        </SiteSettingsProvider>
    )
}

export default App
