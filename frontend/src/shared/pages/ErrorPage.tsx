import { AlertOctagon, RefreshCw } from "lucide-react"

export default function ErrorPage() {
  const handleReload = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border bg-destructive/5 border-destructive/20 shadow-2xl space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-destructive/10 text-destructive">
          <AlertOctagon className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Application Exception</h2>
          <p className="text-sm text-muted-foreground">
            A runtime exception occurred in the web context. Ensure the API endpoint is active and online.
          </p>
        </div>

        <button
          onClick={handleReload}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-destructive hover:bg-destructive/95 text-destructive-foreground text-sm font-semibold shadow-md transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Application</span>
        </button>
      </div>
    </div>
  )
}
