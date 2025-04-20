"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Share2 } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === "dark"

  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-700 bg-[#1e2030]">
      <div className="flex items-center">
        <div className="mr-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 5L12 5M12 5L20 5M12 5V19M12 19L4 19M12 19L20 19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={`${isDarkTheme ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"}`}
            onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
          >
            {isDarkTheme ? (
              <div className="flex items-center gap-2">
                <Moon size={16} />
                <span>DARK UI</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sun size={16} />
                <span>LIGHT UI</span>
              </div>
            )}
          </Button>

          <Button variant="outline" size="sm" className="bg-[#4d7cfe] border-[#4d7cfe] text-white hover:bg-blue-700">
            <div className="flex items-center gap-2">
              <span>SYNTAX SETTINGS</span>
            </div>
          </Button>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className={`${isDarkTheme ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"}`}
      >
        <div className="flex items-center gap-2">
          <Share2 size={16} />
          <span>SHARE SESSION</span>
        </div>
      </Button>
    </header>
  )
}
