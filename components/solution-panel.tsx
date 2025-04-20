"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"

interface SolutionPanelProps {
  problemId: string
  onSubmit: () => void
}

export function SolutionPanel({ problemId, onSubmit }: SolutionPanelProps) {
  const [submissions, setSubmissions] = useState<
    Array<{
      id: number
      status: "accepted" | "wrong" | "pending"
      timestamp: Date
    }>
  >([])
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  const handleSubmit = () => {
    // Add a new submission
    const newSubmission = {
      id: submissions.length + 1,
      status: "pending" as const,
      timestamp: new Date(),
    }

    setSubmissions([newSubmission, ...submissions])

    // Simulate submission processing
    setTimeout(() => {
      setSubmissions((prev) => {
        const updated = [...prev]
        const index = updated.findIndex((s) => s.id === newSubmission.id)
        if (index !== -1) {
          // Randomly decide if submission is accepted or wrong for demo
          updated[index] = {
            ...updated[index],
            status: Math.random() > 0.3 ? "accepted" : "wrong",
          }
        }
        return updated
      })

      onSubmit()
    }, 2000)
  }

  return (
    <div className={`p-4 border-t ${isDarkTheme ? "border-gray-700 bg-[#1e2030]" : "border-gray-300 bg-gray-50"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Submissions</h3>
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
          Submit Solution
        </Button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {submissions.length === 0 ? (
          <p className="text-gray-500 text-sm">No submissions yet</p>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className={`p-2 rounded flex items-center justify-between ${
                submission.status === "accepted"
                  ? isDarkTheme
                    ? "bg-green-900/20"
                    : "bg-green-100"
                  : submission.status === "wrong"
                    ? (isDarkTheme ? "bg-red-900/20" : "bg-red-100")
                    : (isDarkTheme ? "bg-gray-800" : "bg-gray-200")
              }`}
            >
              <div className="flex items-center gap-2">
                {submission.status === "accepted" ? (
                  <CheckCircle className="text-green-500" size={18} />
                ) : submission.status === "wrong" ? (
                  <AlertTriangle className="text-red-500" size={18} />
                ) : (
                  <Clock className="text-gray-500" size={18} />
                )}
                <span>Submission #{submission.id}</span>
              </div>
              <span className="text-sm text-gray-500">{submission.timestamp.toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
