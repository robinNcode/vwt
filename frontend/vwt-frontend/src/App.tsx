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
import AdminSettings from './pages/admin/Settings'

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0D0F14] text-white">Loading...</div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
                            <Navbar />
                            <main><Home /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/products" element={
                        <div className="min-h-screen bg-white font-sans text-slate-900">
                            <Navbar />
                            <main><Products /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/services" element={
                        <div className="min-h-screen bg-white font-sans text-slate-900">
                            <Navbar />
                            <main><Services /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/contact" element={
                        <div className="min-h-screen bg-white font-sans text-slate-900">
                            <Navbar />
                            <main><Contact /></main>
                            <Footer />
                        </div>
                    } />
                    <Route path="/login" element={
                        <div className="min-h-screen bg-white font-sans text-slate-900">
                            <Navbar />
                            <main><Login /></main>
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
                    <Route path="/admin/settings" element={<AdminLayout children={<AdminSettings />} />} />
                </Routes>
            </Suspense>
        </Router>
    )
}

export default App
