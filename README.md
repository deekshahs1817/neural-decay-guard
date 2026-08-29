# 🧠 Neural Decay Guard

[![Live App](https://img.shields.io/badge/Live_Demo-Render_Cloud-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://neural-decay-guard.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://neural-decay-guard.onrender.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://neural-decay-guard.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://neural-decay-guard.onrender.com)

A full-stack, AI-powered Cognitive Training & Algorithmic Spaced-Repetition Platform designed to combat neural decay through consistent, gamified practice across Data Structures, Algorithms, and Computer Science Core Subjects.

---

## 🌐 Live Production Deployment

👉 **Live Application Link**: **[https://neural-decay-guard.onrender.com](https://neural-decay-guard.onrender.com)**

* **Dashboard & Real-Time Analytics**: [https://neural-decay-guard.onrender.com/dashboard](https://neural-decay-guard.onrender.com/dashboard)
* **Daily Retention Quiz (1 submission/day)**: [https://neural-decay-guard.onrender.com/daily-quiz](https://neural-decay-guard.onrender.com/daily-quiz)
* **Monthly LeetCode Calendar Challenge**: [https://neural-decay-guard.onrender.com/daily-challenge](https://neural-decay-guard.onrender.com/daily-challenge)
* **DSA Mastery Roadmap (25 Sets)**: [https://neural-decay-guard.onrender.com/dsa-roadmap](https://neural-decay-guard.onrender.com/dsa-roadmap)
* **CSE Core Subjects Academy (7 Courses)**: [https://neural-decay-guard.onrender.com/core-subjects](https://neural-decay-guard.onrender.com/core-subjects)

---

## ✨ Key Features

1. **🧠 Daily Spaced-Repetition Quiz**:
   - Strictly restricted to **1 submission per calendar day** for scientifically spaced recall.
   - Real-time midnight countdown lock and streak protection.
   - Primary driver for maintaining your consecutive-day **Retention Streak**.

2. **📅 30-Day LeetCode Challenge Calendar**:
   - Curated monthly calendar with direct links to top LeetCode problems (Easy, Medium, Hard).
   - Interactive verification checkmarks to track your daily problem-solving milestones.
   - Unlocks the prestigious **Monthly Champion Badge** upon 100% completion.

3. **📊 Unified Analytics Graph & 1-Year Contribution Heatmap**:
   - 4-in-1 metric filters: *All Activities*, *Retention Quizzes*, *LeetCode Checks*, *Course & DSA Sets*, and *XP Velocity*.
   - GitHub/LeetCode-style 365-day rolling contribution heatmap grid.
   - Full timezone synchronization between browser local time and server timestamps.

4. **🛣️ DSA Mastery Roadmap**:
   - 25 structured curriculum sets covering Arrays, Linked Lists, Trees, Graphs, DP, Heaps, and Tries.
   - Integrated MCQs and verified test suite workspace practice.

5. **🎓 CSE Core Subjects Academy**:
   - 7 university-grade courses (DBMS, Operating Systems, Computer Networks, System Design, OOPs, Computer Organization, Software Engineering).
   - 25 unique sets per course with verifiable mastery completion certificates.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas connection string)
- Environment variables configured in `.env` (or backend config)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
```
*The backend API boots up at `http://localhost:5000` connected to MongoDB.*

### 2. Start the Frontend Application
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend client will launch at `http://localhost:5173`.*

### 3. Open in Browser
Visit **`http://localhost:5173`** to access the application locally.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM
- **Backend**: Node.js, Express.js, Mongoose, JWT Authentication, CORS
- **Database**: MongoDB Atlas
- **Hosting & CI/CD**: Render Cloud Platform
