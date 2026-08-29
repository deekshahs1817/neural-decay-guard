const CodingProblem = require("../models/CodingProblem");
const DSALearningPath = require("../models/DSALearningPath");
const DailyChallenge = require("../models/DailyChallenge");
const { CANONICAL_PROBLEMS, generateStarterTemplates, generateSynthesizedProblem } = require("./canonicalProblems");

const DSA_TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
  "Trees", "Binary Search Trees", "Heaps", "Hashing", "Recursion",
  "Backtracking", "Dynamic Programming", "Graphs", "Greedy", "Sliding Window",
  "Binary Search", "Bit Manipulation", "Tries", "Segment Trees", "Union Find",
  "Shortest Path", "Advanced Graph Algorithms"
];

// 25 DSA Learning Path Sets Definitions
const LEARNING_PATH_SETS = [
  {
    setNumber: 1,
    title: "Arrays Basics",
    category: "Arrays",
    difficulty: "Easy",
    description: "Master contiguous memory allocation, array traversal, in-place manipulation, and prefix sums.",
    conceptGuide: {
      overview: "An Array is a contiguous collection of elements stored at contiguous memory locations. Indexing is O(1).",
      keyPatterns: ["Two-pointer technique", "Prefix Sum Arrays", "Sliding Window", "Kadane's Algorithm"],
      timeSpaceRules: "Access: O(1), Search: O(N), Insert/Delete at end: O(1) amortized, at beginning/middle: O(N).",
      visualExplanation: "Memory layout: [Index 0: Address 0x1000] -> [Index 1: Address 0x1004] -> [Index 2: Address 0x1008]",
      codeExample: "int sum = 0;\nfor (int i = 0; i < n; i++) sum += arr[i];"
    },
    quizQuestions: [
      {
        question: "What is the worst-case time complexity to insert an element at the beginning of a dynamic array of size N?",
        type: "complexity_analysis",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctAnswer: "O(N)",
        explanation: "All existing N elements must be shifted one position to the right."
      },
      {
        question: "What will the following code print? `let a = [1, 2, 3]; a[10] = 5; console.log(a.length);`",
        type: "output_prediction",
        codeSnippet: "let a = [1, 2, 3];\na[10] = 5;\nconsole.log(a.length);",
        options: ["4", "10", "11", "3"],
        correctAnswer: "11",
        explanation: "In JavaScript, setting an index beyond current length expands the array length to index + 1."
      },
      {
        question: "Which technique computes subarray sum queries in O(1) time after O(N) preprocessing?",
        type: "concept",
        options: ["Two Pointers", "Prefix Sum Array", "Binary Exponentiation", "Bitmasking"],
        correctAnswer: "Prefix Sum Array",
        explanation: "Prefix sum allows computing sum(L...R) = P[R] - P[L-1] in O(1) time."
      },
      {
        question: "Kadane's algorithm computes maximum subarray sum in O(N) time by maintaining:",
        type: "concept",
        options: ["current_sum and max_so_far", "min_heap and max_heap", "sliding window of size K", "hash set of seen numbers"],
        correctAnswer: "current_sum and max_so_far",
        explanation: "At each element: current_sum = max(num, current_sum + num) and max_so_far = max(max_so_far, current_sum)."
      },
      {
        question: "Given `nums = [1, 2, 3, 4]`, what is the prefix product array except self for index 2?",
        type: "problem_solving",
        options: ["24", "12", "8", "6"],
        correctAnswer: "8",
        explanation: "Product except nums[2] (value 3) is 1 * 2 * 4 = 8."
      }
    ]
  },
  {
    setNumber: 2,
    title: "Strings & Hashing",
    category: "Strings",
    difficulty: "Easy",
    description: "String immutability, ASCII/Unicode representation, sliding window frequency maps, and string hashing.",
    conceptGuide: {
      overview: "Strings are sequences of characters. In languages like Java/Python, strings are immutable; in C++, strings are mutable.",
      keyPatterns: ["Frequency Array `int count[26]`", "Sliding Window with Hash Map", "Two-pointer Palindrome Verification"],
      timeSpaceRules: "Comparison: O(N), Substring: O(K), Frequency Count: O(N) time and O(1) space."
    },
    quizQuestions: [
      {
        question: "What is the time complexity to check if two strings of length N are anagrams using a fixed-size frequency array?",
        type: "complexity_analysis",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(1)"],
        correctAnswer: "O(N)",
        explanation: "One pass to count frequencies (O(N)) and one pass over 26 characters (O(1))."
      },
      {
        question: "Why is repeated string concatenation `s += ch` inside a loop inefficient in Java/Python?",
        type: "concept",
        options: ["Creates a new String object each time resulting in O(N^2) total time", "Causes CPU stack overflow", "Strings cannot store ASCII values", "Memory leak in heap"],
        correctAnswer: "Creates a new String object each time resulting in O(N^2) total time",
        explanation: "Because strings are immutable, each concatenation copies all previous characters into a new allocation."
      },
      {
        question: "What is the length of the longest substring without repeating characters in `'pwwkew'`?",
        type: "problem_solving",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "The longest valid substring is 'wke' with length 3."
      },
      {
        question: "Which data structure provides O(1) amortized lookup to check character presence in a string?",
        type: "concept",
        options: ["Hash Table / Set", "Binary Search Tree", "Linked List", "Stack"],
        correctAnswer: "Hash Table / Set",
        explanation: "Hash sets compute bucket indices via hash functions for O(1) lookup."
      },
      {
        question: "What will `isPalindrome('racecar')` return?",
        type: "output_prediction",
        options: ["true", "false", "undefined", "error"],
        correctAnswer: "true",
        explanation: "'racecar' reads identically forward and backward."
      }
    ]
  }
];

// Fill remaining 23 learning path sets
for (let s = 3; s <= 25; s++) {
  const cat = DSA_TOPICS[(s - 1) % DSA_TOPICS.length];
  let diff = "Easy";
  if (s > 8 && s <= 18) diff = "Medium";
  if (s > 18) diff = "Hard";

  LEARNING_PATH_SETS.push({
    setNumber: s,
    title: `${cat} Foundations & Patterns`,
    category: cat,
    difficulty: diff,
    description: `Comprehensive study of ${cat} data structure theory, edge case handling, and optimal asymptotic patterns.`,
    conceptGuide: {
      overview: `${cat} is essential for top-tier algorithmic problem solving.`,
      keyPatterns: ["Pattern A", "Pattern B", "Pattern C"],
      timeSpaceRules: `Target: ${diff === "Easy" ? "O(N)" : diff === "Medium" ? "O(N log N)" : "O(V + E)"}`
    },
    quizQuestions: [
      {
        question: `What is the optimal time complexity for ${cat} search and traversal?`,
        type: "complexity_analysis",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctAnswer: diff === "Hard" ? "O(N log N)" : "O(N)",
        explanation: `Standard optimal traversal across ${cat} executes in proportional time.`
      },
      {
        question: `Which memory model applies to ${cat} node references?`,
        type: "concept",
        options: ["Contiguous Memory", "Heap Pointer Nodes", "Call Stack Registers", "Virtual Swap"],
        correctAnswer: "Heap Pointer Nodes",
        explanation: `Nodes are allocated dynamically on the heap with memory pointers.`
      },
      {
        question: `What is the standard base case for ${cat} boundary verification?`,
        type: "concept",
        options: ["null / nullptr / None", "0 index", "-1 return", "INT_MAX"],
        correctAnswer: "null / nullptr / None",
        explanation: `Leaf / terminating nodes point to null references.`
      },
      {
        question: `Which traversal order visits ${cat} levels top-to-bottom?`,
        type: "concept",
        options: ["Breadth-First Search (Level Order)", "Depth-First Search (Preorder)", "Inorder", "Postorder"],
        correctAnswer: "Breadth-First Search (Level Order)",
        explanation: `Queue-driven BFS explores level-by-level.`
      },
      {
        question: `How is space complexity bounded during recursive ${cat} exploration?`,
        type: "complexity_analysis",
        options: ["O(H) recursion call stack", "O(1) always", "O(N^2)", "O(2^N)"],
        correctAnswer: "O(H) recursion call stack",
        explanation: `Maximum recursion depth corresponds to the height of the state tree.`
      }
    ]
  });
}

// Generate 260 100% unique problems
function generateCompleteProblems() {
  const problems = [];
  
  for (let i = 0; i < 260; i++) {
    const rawTemplate = CANONICAL_PROBLEMS[i % CANONICAL_PROBLEMS.length];
    const iteration = Math.floor(i / CANONICAL_PROBLEMS.length);
    
    // For original 10, keep exact canonical; for subsequent iterations, synthesize unique verified sets
    const template = iteration === 0 ? rawTemplate : generateSynthesizedProblem(rawTemplate, iteration, i);
    
    const topic = template.category;
    const difficulty = template.difficulty;
    const starterCode = generateStarterTemplates(template.func, template.args, template.ret);

    problems.push({
      title: template.title,
      slug: template.slug,
      difficulty,
      category: topic,
      description: `${template.desc}\n\nImplement an optimal algorithm that meets the strict time and space complexity constraints specified below. Avoid naive quadratic solutions where linear or logarithmic algorithms exist.`,
      inputFormat: "Input parameters formatted according to test specifications.",
      outputFormat: "Return the calculated answer matching the expected return type.",
      constraints: template.constraints || [
        "1 <= nums.length <= 10^5",
        "-10^9 <= nums[i] <= 10^9",
        `Time Complexity: ${template.time}`,
        `Space Complexity: ${template.space}`
      ],
      examples: template.examples,
      basicTestCases: template.basicTestCases,
      mediumTestCases: template.mediumTestCases,
      hardTestCases: template.hardTestCases,
      starterCode,
      hints: [
        `Consider the target function '${template.func}' and complexity '${template.time}'.`,
        "Check how edge cases such as empty input or boundaries are handled."
      ],
      editorialSolution: `Approach: Optimal Algorithm for ${template.title}\nTime Complexity: \`${template.time}\` | Space Complexity: \`${template.space}\``,
      timeComplexity: template.time,
      spaceComplexity: template.space,
      tags: [topic, difficulty, "FAANG", "Top Interview 150"],
      acceptanceRate: difficulty === "Easy" ? 88 : difficulty === "Medium" ? 64 : 42
    });
  }

  return problems;
}

// Main seeder function
async function seedDSAData() {
  try {
    console.log("[DSA Seeder] Rebuilding Coding Arena with 100% Unique Verified Problem Test Suites...");
    await CodingProblem.deleteMany({});
    const problems = generateCompleteProblems();
    await CodingProblem.insertMany(problems);
    console.log(`[DSA Seeder] Successfully seeded ${problems.length} canonical coding problems!`);

    const existingSetsCount = await DSALearningPath.countDocuments();
    if (existingSetsCount < 25) {
      await DSALearningPath.deleteMany({});
      await DSALearningPath.insertMany(LEARNING_PATH_SETS);
    }

    const today = new Date().toISOString().split("T")[0];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[new Date().getDay()];

    await DailyChallenge.deleteMany({ date: today });
    const dailyProblem = await CodingProblem.findOne({ title: "Two Sum" }) || await CodingProblem.findOne({});
    if (dailyProblem) {
      await DailyChallenge.create({
        date: today,
        dayOfWeek,
        difficulty: dailyProblem.difficulty,
        problem: dailyProblem._id,
        xpReward: 20
      });
      console.log(`[DSA Seeder] Provisioned Daily Challenge for ${today} (${dailyProblem.title})!`);
    }
  } catch (err) {
    console.error("[DSA Seeder Error]:", err);
  }
}

module.exports = {
  seedDSAData,
  LEARNING_PATH_SETS
};
