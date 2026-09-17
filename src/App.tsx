import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AdminLayout } from './components/layout/AdminLayout'
import { Footer } from './components/layout/Footer'
import { GuestRoute } from './components/layout/GuestRoute'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { Container } from './components/ui/Container'
import { Spinner } from './components/ui/Spinner'
import { HomePage } from './pages/HomePage'

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

const PublicEventsPage = lazy(() =>
  import('./pages/public/PublicEventsPage').then((module) => ({ default: module.PublicEventsPage })),
)
const PublicEventDetailPage = lazy(() =>
  import('./pages/public/PublicEventDetailPage').then((module) => ({
    default: module.PublicEventDetailPage,
  })),
)
const PublicRegisterPage = lazy(() =>
  import('./pages/public/PublicRegisterPage').then((module) => ({
    default: module.PublicRegisterPage,
  })),
)
const PublicSuccessPage = lazy(() =>
  import('./pages/public/PublicSuccessPage').then((module) => ({ default: module.PublicSuccessPage })),
)

const AdminProfilePage = lazy(() =>
  import('./pages/admin/AdminProfilePage').then((module) => ({ default: module.AdminProfilePage })),
)
const OrganizationsPage = lazy(() =>
  import('./pages/admin/OrganizationsPage').then((module) => ({ default: module.OrganizationsPage })),
)
const OrganizationDetailPage = lazy(() =>
  import('./pages/admin/OrganizationDetailPage').then((module) => ({
    default: module.OrganizationDetailPage,
  })),
)
const DivisionsPage = lazy(() =>
  import('./pages/admin/DivisionsPage').then((module) => ({ default: module.DivisionsPage })),
)
const EventsPage = lazy(() =>
  import('./pages/admin/EventsPage').then((module) => ({ default: module.EventsPage })),
)
const EventDetailPage = lazy(() =>
  import('./pages/admin/EventDetailPage').then((module) => ({ default: module.EventDetailPage })),
)
const EventFormBuilderPage = lazy(() =>
  import('./pages/admin/EventFormBuilderPage').then((module) => ({
    default: module.EventFormBuilderPage,
  })),
)
const EventRegistrationsPage = lazy(() =>
  import('./pages/admin/EventRegistrationsPage').then((module) => ({
    default: module.EventRegistrationsPage,
  })),
)
const RegistrationDetailPage = lazy(() =>
  import('./pages/admin/RegistrationDetailPage').then((module) => ({
    default: module.RegistrationDetailPage,
  })),
)
const MembersPage = lazy(() =>
  import('./pages/admin/MembersPage').then((module) => ({ default: module.MembersPage })),
)
const MemberDetailPage = lazy(() =>
  import('./pages/admin/MemberDetailPage').then((module) => ({ default: module.MemberDetailPage })),
)

function RouteFallback() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="size-5 text-emerald" />
    </Container>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function AdminFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="size-5 text-emerald" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route path="/events" element={<PublicEventsPage />} />
            <Route path="/events/:slug" element={<PublicEventDetailPage />} />
            <Route path="/events/:slug/register" element={<PublicRegisterPage />} />
            <Route path="/events/:slug/success" element={<PublicSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/profil"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminProfilePage />
                </Suspense>
              }
            />
            <Route
              path="/organizations"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <OrganizationsPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <OrganizationDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id/divisions"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <DivisionsPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id/events"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <EventsPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id/events/:eventId"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <EventDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id/events/:eventId/form-builder"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <EventFormBuilderPage />
                </Suspense>
              }
            />
            <Route
              path="/organizations/:id/events/:eventId/registrations"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <EventRegistrationsPage />
                </Suspense>
              }
            />
            <Route
              path="/registrations/:id"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <RegistrationDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/members"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <MembersPage />
                </Suspense>
              }
            />
            <Route
              path="/members/:id"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <MemberDetailPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-sans text-sm',
            style: {
              background: '#fdfbf6',
              border: '1px solid #e5dfd0',
              color: '#16211d',
              borderRadius: '0.625rem',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}