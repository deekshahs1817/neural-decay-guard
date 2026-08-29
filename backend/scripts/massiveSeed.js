const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Problem = require("../models/Problem");

const categories = [
  { name: "DBMS", baseCorrect: "Consistency", opt: ["Atomicity", "Isolation", "Durability"] },
  { name: "DSA", baseCorrect: "O(N log N)", opt: ["O(N)", "O(N^2)", "O(1)"] },
  { name: "Java", baseCorrect: "JVM", opt: ["JRE", "JDK", "JIT"] },
  { name: "C", baseCorrect: "Pointers", opt: ["References", "Classes", "Interfaces"] },
  { name: "Python", baseCorrect: "Indentation", opt: ["Braces", "Semicolons", "Macros"] },
  { name: "CN", baseCorrect: "TCP/IP", opt: ["OSI", "HTTP", "FTP"] },
  { name: "COA", baseCorrect: "ALU", opt: ["CU", "Registers", "Bus"] },
  { name: "OS", baseCorrect: "Kernel", opt: ["Shell", "GUI", "Compiler"] }
];

const difficulties = ["Easy", "Medium", "Hard"];

const generateMassiveDatabase = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected for Mass Execution...");

    // Wipe Old Problems safely silently
    await Problem.deleteMany({});
    console.log("Database Flushed. Synthesizing 1600 algorithms...");

    let bulkData = [];

    categories.forEach(cat => {
      for (let i = 1; i <= 200; i++) {
        // Pseudo-randomize options and difficulty
        const diffIndex = (i % 3);
        const correct = `${cat.baseCorrect} Concept #${i}`;
        const options = [...cat.opt, correct].sort(() => Math.random() - 0.5);

        bulkData.push({
          title: `${cat.name} Mastery Challenge #${i}`,
          category: cat.name,
          difficulty: difficulties[diffIndex],
          type: "mcq",
          description: `Identify the core architecture parameter critical for solving advanced constraints in ${cat.name} system evaluation #${i}.`,
          correctAnswer: correct,
          options: options,
          explanation: `In ${cat.name}, structural mapping #${i} requires strict adherence to ${correct} to prevent system faults or memory leaks.`,
        });
      }
    });

    await Problem.insertMany(bulkData);
    console.log(`Successfully Synthesized & Ingested ${bulkData.length} problems!`);

    process.exit(0);
  } catch (error) {
    console.error("Critical Failure:", error);
    process.exit(1);
  }
};

generateMassiveDatabase();
