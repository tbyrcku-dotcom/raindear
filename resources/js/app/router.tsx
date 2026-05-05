import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import PublicLayout from '@/components/layout/PublicLayout';
import { DeerMark } from '@/components/deer/DeerMark';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const MenuPage = lazy(() => import('@/pages/public/MenuPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ReservationPage = lazy(() => import('@/pages/public/ReservationPage'));
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminMenuItems = lazy(() => import('@/pages/admin/AdminMenuItems'));
const AdminReservations = lazy(() => import('@/pages/admin/AdminReservations'));
const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));
const AdminEventInquiries = lazy(() => import('@/pages/admin/AdminEventInquiries'));
const AdminGallery = lazy(() => import('@/pages/admin/AdminGallery'));

function PageFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-ink">
            <DeerMark size={64} stroke="var(--color-gold)" animated />
        </div>
    );
}

export default function AppRouter() {
    return (
        <Suspense fallback={<PageFallback />}>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="reservation" element={<ReservationPage />} />
                    <Route path="contact" element={<ContactPage />} />
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="menu-items" element={<AdminMenuItems />} />
                    <Route path="reservations" element={<AdminReservations />} />
                    <Route path="event-inquiries" element={<AdminEventInquiries />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="gallery" element={<AdminGallery />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
