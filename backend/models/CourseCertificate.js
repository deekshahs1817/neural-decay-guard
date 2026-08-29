const mongoose = require("mongoose");

const courseCertificateSchema = new mongoose.Schema({
  certificateId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // e.g. 'NG-CERT-DBMS-89240F'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true, index: true },
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true },
  
  gradeScore: { type: Number, required: true }, // e.g. 96 (%)
  honorTitle: { type: String, default: "Executive Mastery with Distinction" },
  skillsCertified: { type: [String], default: [] },
  issueDate: { type: Date, default: Date.now },
  
  verificationHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.CourseCertificate || mongoose.model("CourseCertificate", courseCertificateSchema);
