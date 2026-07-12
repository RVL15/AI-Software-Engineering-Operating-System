import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "../../shared/services/apiClient"
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  FolderOpen,
  ArrowLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

interface Requirement {
  id: number
  category: string
  title: string
  description: string
  status: string
}

interface ProjectSummary {
  projectId: number
  projectName: string
  description: string
  progress: number
  status: string
  requirements: Requirement[]
}

export default function SummaryPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get<ProjectSummary>(`/api/v1/projects/${projectId}/summary`)
      if (res.success) {
        setSummary(res.data)
      } else {
        toast.error(res.message || "Failed to load project summary")
        navigate("/projects")
      }
    } catch (e) {
      toast.error("Network error retrieving project summary")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchSummary()
    }
  }, [projectId])

  const handleExport = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    const token = localStorage.getItem("forgemind_token")

    // Open export link directly with token query param or download via fetch
    // To cleanly download the file with authorization headers, let's use a fetch request
    toast.info("Starting file download...")
    
    fetch(`${BASE_URL}/api/v1/projects/${projectId}/export`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Export failed")
        return res.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `requirements_spec_${projectId}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Markdown specification downloaded successfully!")
      })
      .catch(() => {
        toast.error("Failed to download requirements document")
      })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Retrieving compiled requirements specifications...</p>
      </div>
    )
  }

  // Group requirements by category
  const groupedRequirements = summary?.requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = []
    }
    acc[req.category].push(req)
    return acc;
  }, {} as Record<string, Requirement[]>) || {}

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header back navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </button>
      </div>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-xl border bg-card/45 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {summary?.projectName}
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              <CheckCircle className="h-3 w-3" />
              <span>SRS Generated</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            {summary?.description || "No project description provided."}
          </p>
        </div>
        
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-md transition-all text-sm whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          <span>Download Markdown</span>
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-3">
            <FileText className="h-5 w-5 text-primary" />
            <span>Software Requirements Specification (SRS)</span>
          </h2>

          {Object.keys(groupedRequirements).length === 0 ? (
            <div className="p-8 border border-dashed rounded-xl text-center bg-card/20 space-y-2">
              <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold">No Requirements Compiled</h3>
              <p className="text-xs text-muted-foreground">
                No specifications generated for this scope. Try going back and completing the survey.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedRequirements).map(([cat, reqs]) => (
                <div key={cat} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-lg inline-block uppercase tracking-widest">
                    {cat.replace("_", " ")}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {reqs.map((r) => (
                      <div
                        key={r.id}
                        className="p-5 rounded-xl border bg-card hover:bg-card/75 transition-colors relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-secondary group-hover:bg-primary transition-colors"></div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                              <ChevronRight className="h-4 w-4 text-primary" />
                              <span>{r.title}</span>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed pl-5">
                              {r.description}
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold text-muted-foreground bg-secondary px-2 py-0.5 rounded border uppercase tracking-wider">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
