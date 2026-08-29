const CoreSubjectCourse = require("../models/CoreSubjectCourse");
const CourseCertificate = require("../models/CourseCertificate");
const User = require("../models/User");
const crypto = require("crypto");

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 1. Get All CSE Core Courses with User Progress
const getAllCourses = async (req, res) => {
  try {
    const { userId } = req.query;
    const courses = await CoreSubjectCourse.find()
      .select("courseId title code category icon description topicsCovered totalSets totalQuestions certificateTitle")
      .lean();

    let userProgressMap = {};
    const userCertMap = {};

    if (userId) {
      const user = await User.findById(userId).select("courseProgress");
      if (user && user.courseProgress) {
        userProgressMap = user.courseProgress instanceof Map 
          ? Object.fromEntries(user.courseProgress)
          : user.courseProgress;
      }

      // Fetch all certificates directly from CourseCertificate collection
      const userCerts = await CourseCertificate.find({ userId }).lean();
      userCerts.forEach(cert => {
        userCertMap[cert.courseId] = cert.certificateId;
      });
    }

    const formatted = courses.map(c => {
      const prog = userProgressMap[c.courseId] || { completedSets: [], currentSet: 1, setScores: {}, isCertified: false };
      const completedCount = prog.completedSets ? prog.completedSets.length : 0;
      const progressPercent = Math.round((completedCount / c.totalSets) * 100);
      const certificateId = userCertMap[c.courseId] || prog.certificateId || null;
      const isCertified = !!certificateId || !!prog.isCertified;

      return {
        ...c,
        completedSetsCount: completedCount,
        progressPercent,
        isCompleted: completedCount >= c.totalSets,
        isCertified,
        certificateId
      };
    });

    res.json({ courses: formatted });
  } catch (error) {
    console.error("Get core courses error:", error);
    res.status(500).json({ message: "Failed to fetch core subject courses" });
  }
};

// 2. Get Single Course Details and 25-Set Map
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.query;

    const course = await CoreSubjectCourse.findOne({ courseId }).lean();
    if (!course) return res.status(404).json({ message: "Course not found" });

    let prog = { completedSets: [], currentSet: 1, setScores: {}, isCertified: false };
    let existingCert = null;

    if (userId) {
      const user = await User.findById(userId).select("courseProgress");
      if (user && user.courseProgress) {
        const pMap = user.courseProgress instanceof Map ? Object.fromEntries(user.courseProgress) : user.courseProgress;
        if (pMap[courseId]) prog = pMap[courseId];
      }
      existingCert = await CourseCertificate.findOne({ userId, courseId }).lean();
    }

    const completedNums = (prog.completedSets || []).map(Number);
    const formattedSets = course.sets.map(s => {
      const isCompleted = completedNums.includes(s.setNumber);
      const isUnlocked = s.setNumber === 1 || completedNums.includes(s.setNumber - 1) || s.setNumber <= Number(prog.currentSet || 1);
      const score = prog.setScores ? prog.setScores[String(s.setNumber)] || 0 : 0;

      return {
        setNumber: s.setNumber,
        title: s.title,
        description: s.description,
        questionCount: s.questions.length,
        xpReward: s.xpReward,
        isCompleted,
        isUnlocked,
        score
      };
    });

    const certificateId = existingCert ? existingCert.certificateId : (prog.certificateId || null);
    const isCertified = !!certificateId || !!prog.isCertified;

    res.json({
      courseId: course.courseId,
      title: course.title,
      code: course.code,
      category: course.category,
      icon: course.icon,
      description: course.description,
      topicsCovered: course.topicsCovered,
      certificateTitle: course.certificateTitle,
      totalSets: course.totalSets,
      completedSetsCount: prog.completedSets ? prog.completedSets.length : 0,
      isCertified,
      certificateId,
      sets: formattedSets
    });
  } catch (error) {
    console.error("Get course detail error:", error);
    res.status(500).json({ message: "Failed to load course details" });
  }
};

// 3. Get Single Set Details with Theory & 5 Questions (with shuffled options)
const getSetDetails = async (req, res) => {
  try {
    const { courseId, setNumber } = req.params;
    const course = await CoreSubjectCourse.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const setObj = course.sets.find(s => s.setNumber === parseInt(setNumber));
    if (!setObj) return res.status(404).json({ message: "Set not found" });

    const shuffledQuestions = setObj.questions.map(q => {
      const qObj = q.toObject ? q.toObject() : { ...q };
      return {
        ...qObj,
        options: shuffleArray(qObj.options)
      };
    });

    res.json({
      courseId: course.courseId,
      courseTitle: course.title,
      courseCode: course.code,
      setNumber: setObj.setNumber,
      title: setObj.title,
      description: setObj.description,
      conceptGuide: setObj.conceptGuide,
      questions: shuffledQuestions,
      xpReward: setObj.xpReward
    });
  } catch (error) {
    console.error("Get set detail error:", error);
    res.status(500).json({ message: "Failed to load set details" });
  }
};

// 4. Submit 5-Question Set Assessment
const submitSetAssessment = async (req, res) => {
  try {
    const { courseId, setNumber } = req.params;
    const { userId, answers } = req.body;

    const course = await CoreSubjectCourse.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const setObj = course.sets.find(s => s.setNumber === parseInt(setNumber));
    if (!setObj) return res.status(404).json({ message: "Set not found" });

    let correctCount = 0;
    const results = setObj.questions.map((q, idx) => {
      const userAns = answers[idx] !== undefined ? answers[idx] : (answers[q._id] || answers[String(idx)]);
      const cleanUser = userAns !== undefined && userAns !== null ? String(userAns).trim().toLowerCase() : "";
      const cleanCorrect = q.correctAnswer !== undefined && q.correctAnswer !== null ? String(q.correctAnswer).trim().toLowerCase() : "";
      const isCorrect = cleanUser.length > 0 && cleanUser === cleanCorrect;
      if (isCorrect) correctCount++;

      return {
        questionIndex: idx + 1,
        question: q.question,
        userAnswer: userAns || "Not Answered",
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / setObj.questions.length) * 100);
    const isPassed = scorePercentage >= 60; // 60% or 3/5 to pass

    let xpAwarded = correctCount * 10;
    if (scorePercentage === 100) xpAwarded += 20; // Perfect score bonus

    // Update User Course Progress
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.courseProgress) user.courseProgress = new Map();
        
        let pMap = user.courseProgress instanceof Map ? Object.fromEntries(user.courseProgress) : user.courseProgress;
        let cProg = pMap[courseId] || { completedSets: [], currentSet: 1, setScores: {}, isCertified: false };

        const num = parseInt(setNumber);
        if (isPassed) {
          const existingCompleted = (cProg.completedSets || []).map(Number);
          if (!existingCompleted.includes(num)) {
            existingCompleted.push(num);
            cProg.completedSets = existingCompleted;
          }
          cProg.currentSet = Math.max(Number(cProg.currentSet || 1), num + 1);
        }

        if (!cProg.setScores) cProg.setScores = {};
        cProg.setScores[String(num)] = scorePercentage;

        // Daily Quiz Streak increment
        const today = new Date().toISOString().split("T")[0];
        if (user.lastQuizDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          if (user.lastQuizDate === yesterday) {
            user.quizStreak = (user.quizStreak || 0) + 1;
          } else {
            user.quizStreak = 1;
          }
          user.lastQuizDate = today;
        }

        user.xp = (user.xp || 0) + xpAwarded;
        user.level = Math.floor(user.xp / 100) + 1;

        if (user.courseProgress instanceof Map) {
          user.courseProgress.set(courseId, cProg);
        } else {
          user.courseProgress[courseId] = cProg;
        }

        user.markModified("courseProgress");
        await user.save();
      }
    }

    res.json({
      setNumber: parseInt(setNumber),
      scorePercentage,
      correctCount,
      totalQuestions: setObj.questions.length,
      isPassed,
      xpAwarded,
      nextSetUnlocked: isPassed ? parseInt(setNumber) + 1 : null,
      results
    });
  } catch (error) {
    console.error("Submit course set error:", error);
    res.status(500).json({ message: "Failed to evaluate assessment" });
  }
};

// 5. Claim Course Completion Certificate
const claimCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const course = await CoreSubjectCourse.findOne({ courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    let pMap = user.courseProgress instanceof Map ? Object.fromEntries(user.courseProgress) : user.courseProgress;
    let cProg = pMap[courseId] || { completedSets: [], isCertified: false };

    // Check if all 25 sets are completed
    if (!cProg.completedSets || cProg.completedSets.length < 25) {
      return res.status(400).json({ 
        message: `Incomplete course progress (${cProg.completedSets ? cProg.completedSets.length : 0}/25 sets completed). Complete all 25 sets to unlock your certificate.` 
      });
    }

    // Calculate Average Score across all 25 sets
    let totalScore = 0;
    if (cProg.setScores) {
      const scores = Object.values(cProg.setScores);
      if (scores.length > 0) {
        totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      } else {
        totalScore = 92;
      }
    } else {
      totalScore = 92;
    }

    // Check if certificate already exists
    let existingCert = await CourseCertificate.findOne({ userId, courseId });
    if (!existingCert) {
      const randomHash = crypto.randomBytes(4).toString("hex").toUpperCase();
      const certificateId = `NG-CERT-${courseId.toUpperCase()}-${randomHash}`;
      const verificationHash = crypto.createHash("sha256").update(`${userId}-${courseId}-${Date.now()}`).digest("hex");

      existingCert = new CourseCertificate({
        certificateId,
        userId: user._id,
        studentName: user.name,
        courseId: course.courseId,
        courseTitle: course.certificateTitle || course.title,
        courseCode: course.code,
        gradeScore: totalScore,
        honorTitle: totalScore >= 90 ? "Executive Distinction" : "Standard Honors",
        skillsCertified: course.topicsCovered,
        verificationHash
      });

      await existingCert.save();

      // Add to user certificates and mark certified
      cProg.isCertified = true;
      cProg.certificateId = existingCert.certificateId;
      if (user.courseProgress instanceof Map) {
        user.courseProgress.set(courseId, cProg);
      } else {
        user.courseProgress[courseId] = cProg;
      }
      
      if (!user.certificates) user.certificates = [];
      if (!user.certificates.includes(existingCert._id)) {
        user.certificates.push(existingCert._id);
      }

      user.markModified("courseProgress");
      user.markModified("certificates");
      await user.save();
    }

    res.json({
      message: "Course Completion Certificate successfully issued!",
      certificate: existingCert
    });
  } catch (error) {
    console.error("Claim certificate error:", error);
    res.status(500).json({ message: "Failed to issue certificate" });
  }
};

// 6. Get Certificate by Certificate ID
const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await CourseCertificate.findOne({ certificateId }).populate("userId", "name email");

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found or invalid ID" });
    }

    res.json(cert);
  } catch (error) {
    console.error("Get certificate error:", error);
    res.status(500).json({ message: "Failed to verify certificate" });
  }
};

module.exports = {
  getAllCourses,
  getCourseDetails,
  getSetDetails,
  submitSetAssessment,
  claimCertificate,
  getCertificateById
};
