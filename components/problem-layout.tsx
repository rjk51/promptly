"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProblemDescription } from "@/components/problem-description"
import { CodeEditor } from "@/components/code-editor"
import { ProblemNavigation } from "@/components/problem-navigation"
import { sampleProblems } from "@/lib/sample-problems"
import { useTheme } from "next-themes"

export function ProblemLayout() {
  const [currentProblem, setCurrentProblem] = useState(sampleProblems[0])
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  const handleProblemChange = (problemId: string) => {
    const problem = sampleProblems.find((p) => p.id === problemId)
    if (problem) {
      setCurrentProblem(problem)
    }
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkTheme ? "bg-[#1e2030] text-white" : "bg-white text-gray-900"}`}>
      <Header />
      <ProblemNavigation currentProblemId={currentProblem.id} onProblemChange={handleProblemChange} />
      <div className="flex flex-1 overflow-hidden">
        <ProblemDescription problem={currentProblem} />
        <div className={`w-px ${isDarkTheme ? "bg-gray-700" : "bg-gray-300"}`} />
        <CodeEditor problem={currentProblem} />
      </div>
    </div>
  )
}
