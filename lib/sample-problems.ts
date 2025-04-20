import type { Problem } from "./types"

export const sampleProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
      <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>
    `,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: `function twoSum(nums, target) {
  // Your code here
  
};`,
    language: "javascript",
    testCases: ["[2,7,11,15], 9", "[3,2,4], 6", "[3,3], 6", "[1,2,3,4], 7"],
    expectedOutputs: ["[0,1]", "[1,2]", "[0,1]", "[2,3]"],
  },
  {
    id: "2",
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    description: `
      <p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a <strong>palindrome</strong>, and <code>false</code> otherwise.</p>
      <p>A <strong>palindrome</strong> is a number that reads the same backward as forward.</p>
      <p>For example, <code>121</code> is a palindrome while <code>123</code> is not.</p>
    `,
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome.",
      },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: `function isPalindrome(x) {
  // Your code here
  
};`,
    language: "javascript",
    testCases: ["121", "-121", "10", "12321", "1221"],
    expectedOutputs: ["true", "false", "false", "true", "true"],
  },
]
