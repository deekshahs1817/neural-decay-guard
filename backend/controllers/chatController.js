const { GoogleGenerativeAI } = require("@google/generative-ai");
const { queryKnowledgeBase } = require("../utils/knowledgeBase");

exports.handleChatMessage = async (req, res) => {
  try {
    const { problemTitle, problemDescription, contextMessage } = req.body;
    const cleanMsg = (contextMessage || "").trim().toLowerCase();

    // 1. Check for Greetings & Platform Assistant commands
    if (cleanMsg === "hello" || cleanMsg === "hi" || cleanMsg === "hey" || cleanMsg === "help") {
      return res.json({
        reply: "• **Greetings!** I am your Neural Guide Socratic AI Tutor.\n• **Supported Masteries**:\n  1. 🎓 CSE Core Courses (DBMS, OS, Networks, COA, OOPs, TOC, System Design)\n  2. 💻 25-Set DSA Roadmap & LeetCode Coding Arena\n  3. 🧠 Ebbinghaus Neural Decay Monitoring & Daily Quizzes\n  4. 📜 Verifiable SHA-256 Certifications\n  5. 🌿 Focus Room 4-4-4-4 Box Breathing & Ambient Audio\n• **How to use me**: Ask any technical question or subject name (e.g. 'DBMS', 'OS', 'ACID properties', 'OSI layers')."
      });
    }

    // 2. Query High-Speed Knowledge Matrix (500+ Questions & Core Concepts)
    const kbMatch = queryKnowledgeBase(contextMessage);
    if (kbMatch) {
      return res.json({
        reply: `**[${kbMatch.category}] ${kbMatch.question}**\n\n${kbMatch.answer}`
      });
    }

    // 3. Fallback to Gemini AI if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a strict, helpful, and knowledgeable Computer Science & Platform AI Tutor named "Neural Guide" on the Neural Decay Guard platform.
The student asks: "${contextMessage}"
Context: Problem title "${problemTitle || 'General Study'}", description "${problemDescription || 'Student exploring platform'}".

IMPORTANT FORMATTING RULE: Format your ENTIRE response strictly in structured point-by-point bullet points using '•'. Keep it clean, accurate, and concise (maximum 3-5 bullet points).`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim()) {
          return res.json({ reply: text.trim() });
        }
      } catch (geminiErr) {
        console.warn("Gemini API error fallback:", geminiErr.message);
      }
    }

    // 4. Default Intelligent Socratic Fallback in point-by-point format
    return res.json({
      reply: `• **Inquiry Analysis**: Found key topics regarding "${contextMessage}".\n• **Recommended Learning Pathway**:\n  1. Review theory and progression sets in **CSE Core Academy**.\n  2. Practice hands-on problems in the **Coding Arena**.\n  3. Complete your **Daily Retention Quiz** to prevent synaptic memory decay.\n• **Try asking**: "Explain ACID properties", "What are the 7 OSI layers?", or "Difference between Process and Thread".`
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.json({
      reply: "• Neural subroutines active.\n• Please ask any technical or course question in point-by-point format!"
    });
  }
};
