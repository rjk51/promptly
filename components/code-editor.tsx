"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Play, Maximize2, Minimize2, Check, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { SolutionPanel } from "@/components/solution-panel"
import type { Problem } from "@/lib/types"

interface CodeEditorProps {
  problem: Problem
}

export function CodeEditor({ problem }: CodeEditorProps) {
  const [code, setCode] = useState(problem.starterCode)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isCodeOpen, setIsCodeOpen] = useState(true)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(problem.language)
  const [activeTab, setActiveTab] = useState("code")
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string }>
  >([])
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const editorInstanceRef = useRef<any>(null)
  const { toast } = useToast()
  const isMobile = useMobile()
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Update code when problem changes
  useEffect(() => {
    setCode(problem.starterCode)
    setSelectedLanguage(problem.language)
    setTestResults([])
    setOutput("")
  }, [problem])

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("monaco-editor").then((monaco) => {
        monacoRef.current = monaco

        // Define the Monaco Editor themes
        monaco.editor.defineTheme("darkTheme", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#1e2030",
            "editor.lineHighlightBackground": "#2a2d3e",
          },
        })

        monaco.editor.defineTheme("lightTheme", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#ffffff",
            "editor.lineHighlightBackground": "#f5f5f5",
          },
        })

        // Load the Monaco Editor
        import("@monaco-editor/react").then(({ default: MonacoEditor }) => {
          const Editor = MonacoEditor
          editorRef.current = Editor
          setIsEditorReady(true)
        })
      })
    }
  }, [])

  // Update editor language when selected language changes
  useEffect(() => {
    if (editorInstanceRef.current) {
      monacoRef.current?.editor.setModelLanguage(editorInstanceRef.current.getModel(), selectedLanguage)
    }
  }, [selectedLanguage])

  const handleEditorDidMount = (editor: any) => {
    editorInstanceRef.current = editor
    editor.focus()
  }

  const executeJavaScriptCode = (code: string, testCase: string) => {
    try {
      // Create a safe function from the code
      const functionBody = code
        .replace(/function\s+\w+\s*$$[^)]*$$\s*{/, "")
        .replace(/}$/, "")
        .trim()

      // Extract function name and parameters
      const functionMatch = code.match(/function\s+(\w+)\s*$$([^)]*)$$/)
      if (!functionMatch) {
        return { error: "Could not parse function" }
      }

      const functionName = functionMatch[1]
      const params = functionMatch[2].split(",").map((p) => p.trim())

      // Parse the test case
      const testValues = JSON.parse(`[${testCase}]`)

      // Create the function
      const fn = new Function(...params, functionBody + `; return ${functionName}(${params.join(",")});`)

      // Execute the function with test values
      const result = fn(...testValues)
      return { result: JSON.stringify(result) }
    } catch (error) {
      return { error: (error as Error).message }
    }
  }

  const executePythonCode = (code: string, testCase: string) => {
    // This is a mock implementation since we can't run Python in the browser
    // In a real implementation, this would call a backend service
    return { error: "Python execution is not supported in this demo" }
  }

  const executeCode = (code: string, testCase: string, language: string) => {
    switch (language) {
      case "javascript":
        return executeJavaScriptCode(code, testCase)
      case "python":
        return executePythonCode(code, testCase)
      default:
        return { error: `Language ${language} is not supported yet` }
    }
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput("Running code...")
    let hasErrors = false

    try {
      // Run against all test cases
      const results = problem.testCases.map((testCase, index) => {
        const result = executeCode(code, testCase, selectedLanguage)

        if (result.error) {
          hasErrors = true
          setOutput(`Error: ${result.error}`)
          return {
            passed: false,
            input: testCase,
            expected: problem.expectedOutputs[index],
            actual: `Error: ${result.error}`,
          }
        }

        // Compare with expected output
        const normalizedExpected = problem.expectedOutputs[index].replace(/\s+/g, "")
        const normalizedActual = "result" in result && result.result ? result.result.replace(/\s+/g, "") : ""
        const passed = normalizedActual === normalizedExpected

        return {
          passed,
          input: testCase,
          expected: problem.expectedOutputs[index],
          actual: "result" in result && result.result ? result.result : "undefined",
        }
      })

      setTestResults(results)

      // If there are errors, switch to output tab, otherwise to test cases tab
      if (hasErrors) {
        setActiveTab("output")
      } else {
        setActiveTab("testcases")

        // Show summary in output
        const passedCount = results.filter((r) => r.passed).length
        setOutput(
          `// Execution complete\n// ${passedCount} of ${results.length} test cases passed\n\n// Test Case 1 Output:\n${results[0].actual}`,
        )

        const allPassed = results.every((r) => r.passed)
        if (allPassed) {
          toast({
            title: "Success!",
            description: "All test cases passed!",
          })
        } else {
          toast({
            title: "Some tests failed",
            description: `${passedCount} of ${results.length} tests passed`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`)
      setActiveTab("output")
    } finally {
      setIsRunning(false)
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    // Trigger editor layout update after state change
    setTimeout(() => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.layout()
      }
    }, 100)
  }

  const handleSubmit = () => {
    runCode()
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)

    // Update code to the starter code for the selected language if available
    if (problem.starterCodeMap && problem.starterCodeMap[language]) {
      setCode(problem.starterCodeMap[language])
    }
  }

  return (
    <div
      className={`flex flex-col ${isFullScreen ? "fixed inset-0 z-50" : "w-1/2"} h-full ${isDarkTheme ? "bg-[#1e2030]" : "bg-white"}`}
    >
      <div
        className={`flex items-center justify-between p-2 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-300"}`}
      >
        <div className="flex items-center gap-2">
          <span className="uppercase font-semibold">Code</span>
          <button onClick={() => setIsCodeOpen(!isCodeOpen)}>
            {isCodeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {isRunning ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
            Run Code
          </Button>
          <Button
            onClick={toggleFullScreen}
            variant="outline"
            size="sm"
            className={
              isDarkTheme
                ? "bg-[#1e2030] border-gray-700 text-white hover:bg-gray-800"
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
            }
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList
            className={isDarkTheme ? "bg-[#1e2030] border-b border-gray-700" : "bg-white border-b border-gray-300"}
          >
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="h-[calc(100%-40px)]">
            {isEditorReady ? (
              <editorRef.current
                height="100%"
                language={selectedLanguage}
                value={code}
                theme={isDarkTheme ? "darkTheme" : "lightTheme"}
                onChange={(value: string) => setCode(value)}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Loading editor...</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="output" className={`h-[calc(100%-40px)] ${isDarkTheme ? "bg-[#1e2030]" : "bg-gray-50"}`}>
            <pre className="p-4 h-full overflow-auto font-mono">
              {output || "// Output will appear here after execution"}
            </pre>
          </TabsContent>
          <TabsContent
            value="testcases"
            className={`h-[calc(100%-40px)] ${isDarkTheme ? "bg-[#1e2030]" : "bg-gray-50"}`}
          >
            <div className="p-4 h-full overflow-auto">
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>
              {testResults.length > 0 ? (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${
                        result.passed
                          ? isDarkTheme
                            ? "bg-green-900/20"
                            : "bg-green-100"
                          : isDarkTheme
                            ? "bg-red-900/20"
                            : "bg-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <Check className="text-green-500" size={18} />
                        ) : (
                          <X className="text-red-500" size={18} />
                        )}
                        <span className="font-medium">Test Case {index + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Input:</span>
                          <code className={`ml-2 p-1 rounded ${isDarkTheme ? "bg-gray-800" : "bg-gray-200"}`}>
                            {result.input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span>
                          <code className={`ml-2 p-1 rounded ${isDarkTheme ? "bg-gray-800" : "bg-gray-200"}`}>
                            {result.expected}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Your Output:</span>
                          <code
                            className={`ml-2 p-1 rounded ${
                              result.actual.startsWith("Error:") ? "text-red-500" : ""
                            } ${isDarkTheme ? "bg-gray-800" : "bg-gray-200"}`}
                          >
                            {result.actual}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Run your code to see test results</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SolutionPanel problemId={problem.id} onSubmit={handleSubmit} />
    </div>
  )
}
