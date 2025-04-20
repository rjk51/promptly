"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Problem } from "@/lib/types"
import { useTheme } from "next-themes"

interface ProblemDescriptionProps {
  problem: Problem
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  return (
    <div className={`flex flex-col w-1/2 h-full ${isDarkTheme ? "bg-[#1e2030]" : "bg-white"}`}>
      <div
        className={`flex items-center justify-between p-2 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}
      >
        <div className="flex items-center gap-2">
          <span className="uppercase font-semibold">Terminal</span>
          <button onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
            {isTerminalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-xl font-bold mb-4">{problem.title}</h1>
        <div className="flex gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded text-xs ${problem.difficulty === "Easy" ? "bg-green-600" : problem.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"} text-white`}
          >
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, index) => (
            <span key={index} className={`px-2 py-1 rounded text-xs ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className={`prose ${isDarkTheme ? "prose-invert" : ""} max-w-none`}>
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Examples:</h2>
          {problem.examples.map((example, index) => (
            <div key={index} className={`mb-4 p-3 rounded ${isDarkTheme ? "bg-gray-800" : "bg-gray-100"}`}>
              <p className="font-semibold">Example {index + 1}:</p>
              <pre className="mt-2 whitespace-pre-wrap">{example.input}</pre>
              <p className="mt-2 font-semibold">Output:</p>
              <pre className="mt-2 whitespace-pre-wrap">{example.output}</pre>
              {example.explanation && (
                <>
                  <p className="mt-2 font-semibold">Explanation:</p>
                  <p className="mt-2">{example.explanation}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
          <ul className="list-disc pl-5">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="mb-1">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
