import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "../../shared/services/apiClient"
import {
  Activity,
  Cpu,
  Database,
  Layers,
  Sparkles,
  RefreshCw,
  GitBranch,
  Play
} from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [backendHealth, setBackendHealth] = useState<any>(null)
  const [backendVersion, setBackendVersion] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])

  const fetchHealthAndProjects = async () => {
    setLoading(true)
    try {
      const healthRes = await apiClient.get<any>("/api/v1/system/health")
      const versionRes = await apiClient.get<any>("/api/v1/system/version")
      const projectsRes = await apiClient.get<Project[]>("/api/v1/projects")
      
      if (healthRes.success) {
        setBackendHealth(healthRes.data)
      } else {
        setBackendHealth({ status: "DOWN", database: "UNKNOWN" })
      }

      if (versionRes.success) {
        setBackendVersion(versionRes.data)
      } else {
        setBackendVersion({ version: "Unavailable", name: "ForgeMind X" })
      }

      if (projectsRes.success) {
        setProjects(projectsRes.data)
      }
      toast.success("Dashboard statistics updated")
    } catch (e) {
      setBackendHealth({ status: "DOWN", database: "UNKNOWN" })
      setBackendVersion({ version: "Unavailable", name: "ForgeMind X" })
      toast.error("Failed to connect to ForgeMind backend service")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthAndProjects()
  }, [])

  const totalProjects = projects.length
  const activeSessions = projects.filter((p) => p.status === "IN_PROGRESS").length
  const completedSpecs = projects.filter((p) => p.status === "COMPLETED").length
  const avgProgress =
    totalProjects > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
      : 0

  const stats = [
    { title: "Total Projects", value: totalProjects.toString(), desc: "Requirement collection scopes", icon: GitBranch },
    { title: "Active Wizard Sessions", value: activeSessions.toString(), desc: "Surveys currently in-progress", icon: Cpu },
    { title: "Completed Specifications", value: completedSpecs.toString(), desc: "Structured SRS catalogs compiled", icon: Layers },
    {
      title: "Average Session Progress",
      value: `${avgProgress}%`,
      desc: backendHealth && backendHealth.status === "UP" ? "Connected and operational" : "System integration offline",
      icon: Activity
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            Operational Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor the underlying microservice stack and active project requirements.
          </p>
        </div>
        <button
          onClick={fetchHealthAndProjects}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg border text-sm font-semibold shadow-sm transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Integrations</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">{stat.title}</span>
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Checks & Quickstart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Backend Status */}
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Service Integration Health</span>
          </h3>

          <div className="divide-y">
            {/* Backend REST API */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">Backend API Gateway</h4>
                <p className="text-xs text-muted-foreground">Spring Boot 3 REST controller bindings</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {backendVersion ? backendVersion.version : "Checking..."}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    backendHealth && backendHealth.status === "UP"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-500"
                  }`}
                ></span>
                <span className="text-xs font-bold">
                  {backendHealth && backendHealth.status === "UP" ? "Connected" : "Offline"}
                </span>
              </div>
            </div>

            {/* PostgreSQL Engine */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">Database Instance</h4>
                <p className="text-xs text-muted-foreground">PostgreSQL Flyway migrations schema</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {backendHealth && backendHealth.database ? "Postgres Dialect" : ""}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    backendHealth && backendHealth.status === "UP"
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  }`}
                ></span>
                <span className="text-xs font-bold">
                  {backendHealth && backendHealth.status === "UP" ? "Active" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Actions */}
        <div className="p-6 rounded-xl border bg-card space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Requirement Intelligence</span>
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Translate high-level software ideas into comprehensive specifications. Run the collection wizard to align compliance, portals, and modules.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center justify-between w-full p-3 rounded-lg border bg-secondary/30 hover:bg-accent text-sm text-left transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-bold">Open Projects Workspace</span>
                <span className="text-[10px] text-muted-foreground">Create or resume requirement collections</span>
              </div>
              <Play className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
