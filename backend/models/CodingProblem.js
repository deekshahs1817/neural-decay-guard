const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  explanation: { type: String, default: "" }
}, { _id: false });

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    required: true,
    index: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
      "Trees", "Binary Search Trees", "Heaps", "Hashing", "Recursion",
      "Backtracking", "Dynamic Programming", "Graphs", "Greedy", "Sliding Window",
      "Binary Search", "Bit Manipulation", "Tries", "Segment Trees", "Union Find",
      "Shortest Path", "Advanced Graph Algorithms"
    ],
    index: true
  },
  description: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  constraints: { type: [String], default: [] },
  
  // Examples for the problem statement
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  
  // 3-Level Test Case Validation
  basicTestCases: { type: [testCaseSchema], default: [] },   // 3 visible
  mediumTestCases: { type: [testCaseSchema], default: [] },  // 5 hidden edge cases
  hardTestCases: { type: [testCaseSchema], default: [] },    // 7 hidden performance tests
  
  // Multi-Language Starter Code Templates
  starterCode: {
    c: { type: String, default: "" },
    cpp: { type: String, default: "" },
    java: { type: String, default: "" },
    python: { type: String, default: "" },
    javascript: { type: String, default: "" }
  },

  hints: { type: [String], default: [] },
  editorialSolution: { type: String, default: "" },
  timeComplexity: { type: String, default: "O(N)" },
  spaceComplexity: { type: String, default: "O(1)" },
  
  tags: { type: [String], default: [] },
  acceptanceRate: { type: Number, default: 85 }
}, { timestamps: true });

module.exports = mongoose.models.CodingProblem || mongoose.model("CodingProblem", codingProblemSchema);
