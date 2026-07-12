import { useNavigate } from "react-router-dom"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative max-w-md w-full p-8 rounded-2xl border bg-card/50 backdrop-blur-md shadow-2xl space-y-6">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        {/* 404 Header Icon */}
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <Sparkles className="h-12 w-12 animate-spin duration-1000" style={{ animationDuration: "8s" }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold tracking-tight">Resource Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page or workspace endpoint you are seeking does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-accent text-sm font-semibold transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 transition-all"
          >
            <span>Return Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}
