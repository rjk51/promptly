export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  description: string
  examples: Example[]
  constraints: string[]
  starterCode: string
  language: string
  testCases: string[]
  expectedOutputs: string[]
  starterCodeMap?: Record<string, string>
}
