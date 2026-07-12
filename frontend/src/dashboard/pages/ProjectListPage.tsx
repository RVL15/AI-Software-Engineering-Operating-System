import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "../../shared/services/apiClient"
import {
  FolderPlus,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
  createdAt: string
  updatedAt: string
}

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDesc, setNewProjectDesc] = useState("")
  const [creating, setCreating] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get<Project[]>("/api/v1/projects")
      if (res.success) {
        setProjects(res.data)
      } else {
        toast.error(res.message || "Failed to load projects")
      }
    } catch (e) {
      toast.error("Network error retrieving projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) {
      toast.error("Project name is required")
      return
    }

    setCreating(true)
    try {
      const res = await apiClient.post<Project>("/api/v1/projects", {
        name: newProjectName,
        description: newProjectDesc
      })
      if (res.success) {
        toast.success("Project created successfully!")
        setShowModal(false)
        setNewProjectName("")
        setNewProjectDesc("")
        // Redirect immediately to the workspace question wizard
        navigate(`/workspace/${res.data.id}`)
      } else {
        toast.error(res.message || "Failed to create project")
      }
    } catch (err) {
      toast.error("Error creating project")
    } finally {
      setCreating(false)
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            Your Software Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your dynamic requirement collection scopes and specifications.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-semibold shadow-sm transition-all text-sm"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full bg-background border rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-card/25 gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-bold text-lg">No Projects Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {searchQuery ? "No projects match your filter search." : "Create your first project to start the Requirement Intelligence Engine."}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent rounded-lg border text-sm font-semibold transition-all mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Initialize Project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all relative overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <span
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {p.status === "COMPLETED" ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>In Progress</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">
                  {p.description || "No project description provided."}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Wizard Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Navigation Button */}
                <button
                  onClick={() =>
                    navigate(p.status === "COMPLETED" ? `/summary/${p.id}` : `/workspace/${p.id}`)
                  }
                  className="flex items-center justify-center gap-2 w-full py-2 bg-secondary hover:bg-accent text-sm font-semibold rounded-lg border transition-all"
                >
                  {p.status === "COMPLETED" ? (
                    <>
                      <BookOpen className="h-4 w-4" />
                      <span>View Specifications</span>
                    </>
                  ) : (
                    <>
                      <span>Resume Collection</span>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hospital Management System, Food Delivery Platform"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe your software idea in a few sentences..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold shadow-sm hover:bg-primary/95 transition-all disabled:opacity-50"
                >
                  {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Start Wizard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
