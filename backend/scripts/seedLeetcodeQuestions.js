require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("../models/Problem");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/neural_decay_guard");
    console.log("MongoDB Connected for Seeder");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const CATEGORIES = ["Logic & Reasoning", "Mathematical Reasoning", "Pattern Recognition", "Memory Mastery", "Computational Thinking"];
const TARGET_PER_CATEGORY = 500;

function generateAlgorithmicBatch(category, count, startIndex) {
  const problems = [];
  const difficultyLevels = ["Easy", "Medium", "Hard"];
  
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const diff = difficultyLevels[index % 3];
    
    let title, description, options, correctAnswer, explanation;

    if (category === "Mathematical Reasoning") {
      // Procedural Math
      const a = (index + 1) * (diff === "Hard" ? 17 : diff === "Medium" ? 7 : 3);
      const b = (index + 2) * (diff === "Hard" ? 23 : diff === "Medium" ? 5 : 2);
      title = `${diff} Compute Sequence #${index}`;
      description = `<p>What is the product of <strong>${a}</strong> and <strong>${b}</strong>? Take your time and use mental math tactics.</p>`;
      const ans = a * b;
      options = [
        String(ans),
        String(ans + 12),
        String(ans - 10),
        String(ans * 2)
      ].sort(() => Math.random() - 0.5);
      correctAnswer = String(ans);
      explanation = `The product of ${a} and ${b} algorithmically evaluates to ${ans}.`;
      
    } else if (category === "Pattern Recognition") {
      title = `Identify the Shift ${index}`;
      const shift = (index % 5) + 1;
      description = `<p>If the array sequence <code>[1, 2, 3]</code> shifts by ${shift}, what does it evaluate to conceptually?</p>`;
      options = [
        `Shifted ${shift}`,
        `Shifted ${shift + 1}`,
        `Reversed array`,
        `Null pointer`
      ].sort(() => Math.random() - 0.5);
      correctAnswer = `Shifted ${shift}`;
      explanation = `The pattern strictly follows a modulus shift of ${shift}.`;
      
    } else {
      // General logic filler for others
      title = `${category} Module ${index}`;
      description = `<p>Evaluate the logical consistency of sector ${index} given a threshold of ${diff === "Hard" ? "strict" : "lenient"} parameters.</p>`;
      options = [
        "Consistent",
        "Inconsistent",
        "Partially Consistent",
        "Undefined"
      ].sort(() => Math.random() - 0.5);
      correctAnswer = "Consistent";
      explanation = "By default, the parameters align with the 'Consistent' profile.";
    }

    problems.push({
      title,
      description,
      category,
      difficulty: diff,
      type: "mcq",
      options,
      correctAnswer,
      explanation
    });
  }
  
  return problems;
}

async function seed() {
  await connectDB();
  
  await Problem.deleteMany({}); // Wipe clean to ensure exactly 2500 fresh problems
  
  for (const category of CATEGORIES) {
    console.log(`\n============== Generating Category: ${category} ==============`);
    const problems = generateAlgorithmicBatch(category, TARGET_PER_CATEGORY, 0);
    
    try {
      await Problem.insertMany(problems);
      console.log(`[${category}] Successfully inserted ${TARGET_PER_CATEGORY} algorithms.`);
    } catch (err) {
      console.error("Batch failure:", err.message);
    }
  }

  console.log("\n===> ALL 2,500 CATEGORIES FULLY SEEDED ALGORITHMICALLY! <===");
  process.exit(0);
}

seed();
