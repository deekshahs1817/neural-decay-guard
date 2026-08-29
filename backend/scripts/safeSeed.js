const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Problem = require("../models/Problem");

const seedQuestions = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected for Seeding.");

    const algorithms = [
      {
        title: "Two Sum",
        category: "Arrays",
        difficulty: "Easy",
        type: "mcq",
        options: ["A sorted tree", "A Hash Map", "A Linked List", "Nested For Loops"],
        correctAnswer: "A Hash Map",
        description: "Given an array of integers and a target sum, which data structure is optimal to find the indices of the two numbers in O(N) time?",
        explanation: "A Hash Map allows O(1) worst-case lookups."
      },
      {
        title: "Reverse Linked List",
        category: "Linked Lists",
        difficulty: "Easy",
        type: "mcq",
        options: ["1 pointer", "2 pointers", "3 pointers", "4 pointers"],
        correctAnswer: "3 pointers",
        description: "To reverse a linked list iteratively, how many pointers do you continuously track at minimum? (prev, curr, nextNode)",
        explanation: "You need three pointers to safely rewire references without memory leaks: previous, current, and next."
      },
      {
        title: "Dynamic Programming: Climbing Stairs",
        category: "Dynamic Programming",
        difficulty: "Easy",
        type: "mcq",
        options: ["O(N^2)", "O(2^N)", "O(N)", "O(log N)"],
        correctAnswer: "O(N)",
        description: "If you cache the subproblems using an array mapping sizes N, what is the optimized time complexity to solve the Fibonacci Climbing Stairs approach?",
        explanation: "By avoiding repeated recalculation of the Fibonacci branches via memoization, Time Complexity violently reduces from O(2^N) to precisely O(N)."
      },
      {
        title: "Valid Parentheses Stack",
        category: "Stacks & Queues",
        difficulty: "Medium",
        type: "mcq",
        options: ["LIFO", "FIFO", "LRU", "Segment Tree"],
        correctAnswer: "LIFO",
        description: "Which fundamental computational principle allows a Data Architecture to seamlessly validate trailing sets of {} and [] brackets continuously wrapping each other?",
        explanation: "Stacks operate on Last-In-First-Out (LIFO), allowing you to immediately eject matching sequential chunks natively."
      },
      {
        title: "Merge Intervals",
        category: "Arrays",
        difficulty: "Medium",
        type: "mcq",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(1)"],
        correctAnswer: "O(N log N)",
        description: "Before scanning an array of raw interval timestamps `[[1,3],[2,6],[8,10]]`, sorting them by start time forces the time complexity into what lower bound mathematically?",
        explanation: "The sorting step itself intrinsically demands O(N log N) logic bounding."
      },
      {
        title: "Dijkstra's Shortest Path",
        category: "Graphs",
        difficulty: "Hard",
        type: "mcq",
        options: ["Min-Heap", "Max-Heap", "BST", "Trie"],
        correctAnswer: "Min-Heap",
        description: "Which highly optimized binary abstract data structure must you pair dynamically with Dijkstra's algorithm to resolve Graph Traversals scaling efficiently into O(E log V)?",
        explanation: "A Min-Priority Queue maps vertices based strictly on lowest edge weights dynamically popping into greedy solutions!"
      }
    ];

    // Clear previous questions silently
    await Problem.deleteMany({});
    console.log("Cleared old problems...");
    
    // Inject
    await Problem.insertMany(algorithms);
    console.log("Successfully seeded", algorithms.length, "perfectly realistic algorithm problems.");

    process.exit(0);
  } catch (err) {
    console.error("Error Seeding Data:", err);
    process.exit(1);
  }
};

seedQuestions();
