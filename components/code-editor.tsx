"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeEditorProps {
  initialCode: string
  language: string
  darkMode: boolean
}

export function CodeEditor({ initialCode, language, darkMode }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isCodeOpen, setIsCodeOpen] = useState(true)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("monaco-editor").then((monaco) => {
        monacoRef.current = monaco

        // Define the Monaco Editor theme
        monaco.editor.defineTheme("darkTheme", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#1e2030",
            "editor.lineHighlightBackground": "#2a2d3e",
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

  const handleEditorDidMount = (editor: any) => {
    editor.focus()
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput("Running code...")

    // Simulate code execution
    setTimeout(() => {
      setOutput(
        "// Output will appear here after execution\n// This is a simulated output for demonstration purposes\n\nExecuting code...\n\nSuccess! All test cases passed.",
      )
      setIsRunning(false)
      toast({
        title: "Code executed successfully",
        description: "All test cases passed!",
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col w-1/2 h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="uppercase font-semibold">Code</span>
          <button onClick={() => setIsCodeOpen(!isCodeOpen)}>
            {isCodeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <Button onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
          <Play size={16} className="mr-2" />
          Run Code
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="code" className="h-full">
          <TabsList className="bg-[#1e2030] border-b border-gray-700">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="h-[calc(100%-40px)]">
            {isEditorReady ? (
              <editorRef.current
                height="100%"
                language={language}
                value={code}
                theme={darkMode ? "darkTheme" : "light"}
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
          <TabsContent value="output" className="h-[calc(100%-40px)] bg-[#1e2030]">
            <pre className="p-4 h-full overflow-auto">{output || "// Output will appear here after execution"}</pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
