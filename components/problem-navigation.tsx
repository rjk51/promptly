"use client"
import { ChevronLeft, ChevronRight, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sampleProblems } from "@/lib/sample-problems"
import { useTheme } from "next-themes"

interface ProblemNavigationProps {
  currentProblemId: string
  onProblemChange: (problemId: string) => void
}

export function ProblemNavigation({ currentProblemId, onProblemChange }: ProblemNavigationProps) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  const currentIndex = sampleProblems.findIndex((p) => p.id === currentProblemId)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < sampleProblems.length - 1

  const goToPrevious = () => {
    if (hasPrevious) {
      onProblemChange(sampleProblems[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (hasNext) {
      onProblemChange(sampleProblems[currentIndex + 1].id)
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-2 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={goToPrevious}
        disabled={!hasPrevious}
        className={
          isDarkTheme
            ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800"
            : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
        }
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              isDarkTheme
                ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800"
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
            }
          >
            <List size={16} className="mr-2" />
            Problem List
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sampleProblems.map((problem) => (
            <DropdownMenuItem
              key={problem.id}
              onClick={() => onProblemChange(problem.id)}
              className={problem.id === currentProblemId ? "bg-blue-500 text-white" : ""}
            >
              {problem.id}. {problem.title} ({problem.difficulty})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNext}
        disabled={!hasNext}
        className={
          isDarkTheme
            ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800"
            : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
        }
      >
        Next
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  )
}
