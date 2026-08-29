const mongoose = require("mongoose");

const coreQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["mcq", "sql_query", "output_prediction", "debugging", "concept", "complexity"],
    default: "mcq"
  },
  codeSnippet: { type: String, default: "" },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: true });

const courseSetSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true }, // 1 to 25
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  conceptGuide: {
    overview: { type: String, required: true },
    keyFormulasOrRules: { type: [String], default: [] },
    codeOrQueryExample: { type: String, default: "" },
    interviewTips: { type: String, default: "" }
  },

  questions: { type: [coreQuestionSchema], default: [] }, // 5 questions per set
  xpReward: { type: Number, default: 50 }
}, { _id: false });

const coreSubjectCourseSchema = new mongoose.Schema({
  courseId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // e.g. 'dbms', 'os', 'cn', 'coa', 'oops', 'toc', 'se'
  title: { type: String, required: true },
  code: { type: String, required: true }, // e.g. 'CS-301', 'CS-302'
  category: { type: String, required: true },
  icon: { type: String, default: "BookOpen" },
  description: { type: String, required: true },
  instructor: { type: String, default: "Dr. Alan Turing Neural Fellow" },
  
  topicsCovered: { type: [String], default: [] },
  sets: { type: [courseSetSchema], default: [] }, // 25 Sets
  
  totalSets: { type: Number, default: 25 },
  totalQuestions: { type: Number, default: 125 },
  certificateTitle: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.CoreSubjectCourse || mongoose.model("CoreSubjectCourse", coreSubjectCourseSchema);
