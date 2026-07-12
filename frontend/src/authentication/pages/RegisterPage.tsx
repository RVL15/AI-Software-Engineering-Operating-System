import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiClient } from "../../shared/services/apiClient"
import { Sparkles, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiClient.post<any>("/api/v1/auth/register", {
        username,
        email,
        password
      })

      if (res.success) {
        toast.success(res.message || "Registration completed successfully")
        navigate("/login")
      } else {
        toast.error(res.message || "Registration failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-md w-full p-8 rounded-2xl border bg-card/60 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            Create Workspace Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Initialize your profile configuration to register local environments.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Create password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg shadow-md shadow-primary/20 transition-all text-sm mt-6"
          >
            <span>{loading ? "Registering..." : "Register Workspace"}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
