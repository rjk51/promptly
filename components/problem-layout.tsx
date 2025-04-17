"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProblemDescription } from "@/components/problem-description"
import { CodeEditor } from "@/components/code-editor"
import { sampleProblems } from "@/lib/sample-problems"

export function ProblemLayout() {
  const [currentProblem, setCurrentProblem] = useState(sampleProblems[0])
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="flex flex-col h-screen bg-[#1e2030] text-white">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <ProblemDescription problem={currentProblem} />
        <div className="w-px bg-gray-700" />
        <CodeEditor initialCode={currentProblem.starterCode} language={currentProblem.language} darkMode={darkMode} />
      </div>
    </div>
  )
}
