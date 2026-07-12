import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./shared/hooks/useTheme"
import { Toaster } from "sonner"
import MainLayout from "./shared/layouts/MainLayout"
import DashboardPage from "./dashboard/pages/DashboardPage"
import WorkspacePage from "./ai-workspace/pages/WorkspacePage"
import SettingsPage from "./settings/pages/SettingsPage"
import LoginPage from "./authentication/pages/LoginPage"
import RegisterPage from "./authentication/pages/RegisterPage"
import NotFoundPage from "./shared/pages/NotFoundPage"
import ErrorPage from "./shared/pages/ErrorPage"
import ProjectListPage from "./dashboard/pages/ProjectListPage"
import SummaryPage from "./ai-workspace/pages/SummaryPage"

// Simple Guard Component for JWT check
interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("forgemind_token")
  // In a real application, we would decode or query user status
  // For Phase 0, we can fall back to allowing access even if not signed in so testing is direct,
  // but if the token is present it works. Let's redirect to login if no token is found.
  // Wait, to make testing easy without requiring a database running first, let's auto-generate a demo token if none exists,
  // or simply bypass redirect for phase 0 to show the dashboard immediately, but enforce it if they log out.
  // Let's check: if no token exists, we redirect to login. This enforces secure behavior.
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="forgemind-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Secure Admin Workspace routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectListPage />} />
            <Route path="workspace/:projectId" element={<WorkspacePage />} />
            <Route path="summary/:projectId" element={<SummaryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </ThemeProvider>
  )
}
