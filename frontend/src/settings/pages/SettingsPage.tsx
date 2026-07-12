import { useState } from "react"
import { Settings, Shield, Sliders, Key, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [dbHost, setDbHost] = useState("localhost")
  const [jwtExp, setJwtExp] = useState("604800000")
  const [logLevel, setLogLevel] = useState("DEBUG")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Workspace configuration updated successfully")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage system configurations, environment credentials, and API connection maps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs Mock */}
        <div className="space-y-2 lg:col-span-1">
          <div className="p-4 rounded-xl border bg-card/60 space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-bold text-left transition-colors">
              <Sliders className="h-4 w-4" />
              <span>General Configurations</span>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-accent text-muted-foreground text-sm font-semibold text-left transition-colors">
              <Shield className="h-4 w-4" />
              <span>Credentials & Secrets</span>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-accent text-muted-foreground text-sm font-semibold text-left transition-colors">
              <Key className="h-4 w-4" />
              <span>SSH Keys & Git Auth</span>
            </button>
          </div>
        </div>

        {/* Configuration Panel Form */}
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Platform Variables</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Database Port Host</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">JWT Token Expire Time (ms)</label>
                <input
                  type="text"
                  value={jwtExp}
                  onChange={(e) => setJwtExp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">System Logging Level</label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="DEBUG">DEBUG (Detailed logs)</option>
                <option value="INFO">INFO (Standard logs)</option>
                <option value="WARN">WARN (Warnings only)</option>
                <option value="ERROR">ERROR (Errors only)</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg shadow-sm text-sm transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
