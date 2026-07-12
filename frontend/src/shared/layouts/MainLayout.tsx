import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../hooks/useTheme"
import {
  LayoutDashboard,
  Terminal,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  User,
  ShieldCheck
} from "lucide-react"

export default function MainLayout() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      desc: "Overview & operational metrics"
    },
    {
      title: "AI Workspace",
      path: "/projects",
      icon: Terminal,
      desc: "Autonomous software engineering"
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
      desc: "Configuration & profiles"
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem("forgemind_token")
    navigate("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Get active menu item for breadcrumbs
  const currentMenuItem = menuItems.find(item => item.path === location.pathname)
  const pageTitle = currentMenuItem ? currentMenuItem.title : "System"

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Brand logo */}
        <div className="h-16 border-b flex items-center px-6 justify-between overflow-hidden">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-wider">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            {isSidebarOpen && (
              <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent font-extrabold">
                FORGEMIND <span className="text-foreground">X</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                }`}
                title={!isSidebarOpen ? item.title : ""}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                {isSidebarOpen && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{item.title}</span>
                  </div>
                )}
                {!isSidebarOpen && (
                  <span className="absolute left-20 bg-card border px-2 py-1 rounded text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                    {item.title}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-lg hover:bg-accent border border-dashed text-muted-foreground text-xs font-semibold gap-1"
          >
            {isSidebarOpen ? "Collapse sidebar" : "»"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-200"
          >
            <LogOut className="h-5 w-5 shrink-0 text-muted-foreground" />
            {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden flex">
          <aside className="w-64 bg-card border-r flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="h-16 border-b flex items-center px-6 justify-between">
              <span className="font-extrabold text-lg text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> FORGEMIND X
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-md hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)}></div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b bg-card/75 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-accent text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Platform</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Info pill */}
            <div className="hidden lg:flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Phase 0 Foundation</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent border shadow-sm transition-colors"
              title="Toggle color theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-2 border-l pl-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight">Admin User</span>
                <span className="text-[10px] text-muted-foreground leading-none">admin@fordgex.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
