import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

// Lazy load other pages
const Products = lazy(() => import('./pages/Products'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))

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

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0D0F14] text-slate-900 dark:text-white transition-colors duration-300">Loading...</div>}>
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
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 transition-colors duration-300">
                            <Navbar />
                            <main><Products /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/services" element={
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 transition-colors duration-300">
                            <Navbar />
                            <main><Services /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/contact" element={
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 transition-colors duration-300">
                            <Navbar />
                            <main><Contact /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/login" element={
                        <div className="min-h-screen bg-slate-50 dark:bg-[#0D0F14] font-sans text-slate-900 transition-colors duration-300">
                            <main><Login /></main>
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
                </Routes>
            </Suspense>
        </Router>
    )
}

export default App
