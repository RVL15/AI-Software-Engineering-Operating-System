import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "../../shared/services/apiClient"
import {
  Sparkles,
  Loader2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Save,
  ArrowRight,
  Database,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
}

interface Question {
  id: number
  text: string
  options: string[]
  category: string
  answered: boolean
  selectedOption: string | null
}

export default function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Autosave status
  const [saving, setSaving] = useState(false)
  const [compiling, setCompiling] = useState(false)

  const fetchProjectDetails = async () => {
    try {
      const res = await apiClient.get<Project>(`/api/v1/projects/${projectId}`)
      if (res.success) {
        setProject(res.data)
      } else {
        toast.error(res.message || "Failed to load project details")
        navigate("/projects")
      }
    } catch (e) {
      toast.error("Network error retrieving project details")
    }
  }

  const fetchQuestionAndProgress = async () => {
    try {
      // 1. Fetch next question
      const qRes = await apiClient.get<Question>(`/api/v1/projects/${projectId}/next-question`)
      if (qRes.success) {
        setQuestion(qRes.data)
      } else {
        toast.error(qRes.message || "Failed to load next question")
      }

      // 2. Fetch progress percentage
      const pRes = await apiClient.get<number>(`/api/v1/projects/${projectId}/progress`)
      if (pRes.success) {
        setProgress(pRes.data)
      }
    } catch (e) {
      toast.error("Network error retrieving question status")
    }
  }

  const loadData = async () => {
    setLoading(true)
    await Promise.all([fetchProjectDetails(), fetchQuestionAndProgress()])
    setLoading(false)
  }

  useEffect(() => {
    if (projectId) {
      loadData()
    }
  }, [projectId])

  const handleSelectOption = async (option: string) => {
    if (!question) return

    setSaving(true)
    try {
      const res = await apiClient.post<void>(
        `/api/v1/projects/${projectId}/questions/${question.id}/answer`,
        { selectedOption: option }
      )
      if (res.success) {
        // Successful autosave logic
        await fetchQuestionAndProgress()
      } else {
        toast.error(res.message || "Failed to save answer")
      }
    } catch (err) {
      toast.error("Error connecting to server to save answer")
    } finally {
      setSaving(false)
    }
  }

  const handleCompleteSession = async () => {
    setCompiling(true)
    try {
      const res = await apiClient.post<void>(`/api/v1/projects/${projectId}/complete`, {})
      if (res.success) {
        toast.success("Requirements specification successfully compiled!")
        navigate(`/summary/${projectId}`)
      } else {
        toast.error(res.message || "Failed to compile requirements")
      }
    } catch (err) {
      toast.error("Error finalizing requirements compilation")
    } finally {
      setCompiling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Analyzing project scope and loading wizard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
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

      {/* Project details card */}
      <div className="p-6 rounded-xl border bg-card/45 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project?.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {project?.description || "No project description provided."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span>Scope Refinement</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6 rounded-xl border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Requirement Completion Progress</h3>
          </div>
          <span className="text-sm font-extrabold">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border">
          <div
            className="bg-gradient-to-r from-primary to-violet-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Autosave status indicator */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">All answers are saved automatically.</span>
          <div className="flex items-center gap-2">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                <span className="text-xs font-semibold text-primary">Autosaving changes...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">All changes saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Question Card or Finish Wizard */}
      {question ? (
        <div className="p-8 rounded-xl border bg-card space-y-6 shadow-xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Question category */}
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {question.category.replace("_", " ")}
            </span>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold leading-snug">
            {question.text}
          </h2>

          {/* Options grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={saving}
                className="w-full text-left p-4 rounded-lg border bg-secondary/25 hover:bg-primary/10 hover:border-primary/50 text-sm font-semibold transition-all flex items-center justify-between group"
              >
                <span>{opt}</span>
                <div className="h-5 w-5 rounded-full border flex items-center justify-center group-hover:border-primary transition-colors bg-background">
                  <div className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-primary transition-colors"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl border bg-card space-y-6 shadow-xl text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
          <CheckCircle className="h-16 w-16 text-emerald-400" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Scope Analysis Complete</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You have answered all questions. The AI has compiled all user portal layouts, third-party integrations, and compliance guidelines to generate a custom software requirements specification.
            </p>
          </div>

          <button
            onClick={handleCompleteSession}
            disabled={compiling}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-violet-500 hover:from-primary/95 hover:to-violet-500/95 text-white font-bold rounded-lg shadow-lg hover:shadow-primary/20 transition-all text-sm disabled:opacity-50"
          >
            {compiling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Compiling Requirements Catalog...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Software Specifications</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
