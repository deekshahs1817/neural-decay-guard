const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Provides progressive Socratic hints for coding problems
 * Level 1: Intuitive conceptual hint
 * Level 2: Algorithmic pattern & data structure suggestion
 * Level 3: Concrete pseudocode / step-by-step guidance
 */
async function getProgressiveHint(problem, hintLevel = 1, userCode = "") {
  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
You are the elite Socratic AI Coach of Neural Decay Guard.
Problem Title: "${problem.title}"
Topic: ${problem.category}
Difficulty: ${problem.difficulty}
Description: ${problem.description}
User's Current Code:
${userCode || "No code written yet."}

Request: Provide Hint Level ${hintLevel}/3.
- If Level 1: Give a high-level conceptual nudge without naming the exact data structure or solution.
- If Level 2: Suggest the optimal time/space complexity and algorithmic pattern (e.g. Two Pointers, Monotonic Stack, DP state).
- If Level 3: Provide a structured step-by-step breakdown or pseudocode without giving away the full solution code.

Keep the response concise, encouraging, and under 150 words.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (err) {
    console.error("[AI Coach Gemini Error]:", err.message);
  }

  // High quality fallback hints
  if (hintLevel === 1) {
    return `💡 **Level 1 Intuition**: Think about what property makes this problem special. Are elements sorted, or can you look up previous values in O(1) time?`;
  } else if (hintLevel === 2) {
    return `⚡ **Level 2 Algorithmic Vector**: Consider applying a **${problem.category}** pattern. Target optimal time complexity is **${problem.timeComplexity}** and space complexity is **${problem.spaceComplexity}**.`;
  } else {
    return `🧠 **Level 3 Implementation Blueprint**:
1. Initialize your primary lookup/pointers at boundary positions.
2. Iterate through the input while maintaining your invariant.
3. Update global state and return the result once boundary is reached.`;
  }
}

/**
 * Analyzes code mistakes and runtime errors
 */
async function analyzeCodeMistake(problem, code, language, errorOrFailedTest) {
  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
You are an expert compiler and algorithmic diagnostic AI.
Problem: "${problem.title}"
Language: ${language}
User's Code:
${code}

Test Failure / Diagnostic Output:
${JSON.stringify(errorOrFailedTest)}

Diagnose why this code failed. Explain:
1. The root cause (e.g., edge case handling, off-by-one, timeout, wrong state transition).
2. How to correct the logic.
Keep your response concise, sharp, and easy for a developer to fix immediately.
      `;
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (err) {
    console.error("[AI Coach Diagnostics Error]:", err.message);
  }

  return `⚠️ **Diagnostic Analysis**: Your logic encountered an unexpected return value on edge cases (such as negative integers or array boundary limits). Verify that base cases are guarded before loop execution.`;
}

/**
 * Explains editorial solution in depth
 */
async function explainEditorial(problem, language) {
  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Explain the optimal solution for problem "${problem.title}" (${problem.category}, ${problem.difficulty}) in ${language}.
Explain:
1. Intuition & why naive approaches fail
2. Step-by-step optimal algorithm (${problem.timeComplexity} Time, ${problem.spaceComplexity} Space)
3. Key edge cases
      `;
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (err) {
    console.error("[AI Coach Editorial Error]:", err.message);
  }

  return problem.editorialSolution || "Optimal solution employs state-of-the-art linear time complexity.";
}

module.exports = {
  getProgressiveHint,
  analyzeCodeMistake,
  explainEditorial
};
