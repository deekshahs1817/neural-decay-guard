const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseDetails,
  getSetDetails,
  submitSetAssessment,
  claimCertificate,
  getCertificateById
} = require("../controllers/coreSubjectsController");

// Course List & Details
router.get("/", getAllCourses);
router.get("/:courseId", getCourseDetails);

// Set Concepts & Quiz
router.get("/:courseId/sets/:setNumber", getSetDetails);
router.post("/:courseId/sets/:setNumber/submit", submitSetAssessment);

// Certificate Claim & Verification
router.post("/:courseId/claim-certificate", claimCertificate);
router.get("/certificate/:certificateId", getCertificateById);

module.exports = router;
