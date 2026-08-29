# 🧠 Neural Decay Guard

A full-stack, AI-powered Cognitive Training & LeetCode-style platform designed to combat neural decay through consistent, gamified algorithmic practice. Built using the **MERN** stack and integrated with **Google Gemini AI**.

## 🚀 How to Run This Project Locally (Localhost)

If you meant "how to run this project locally", here are the exact terminal commands required to run the LeetCode-style platform on your machine.

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or Atlas URI)
- Credentials for Google OAuth and Gemini API in your `.env` files.

### Step 1: Start the Backend (API & Database)
Open a terminal, navigate to the `backend` folder, and start the engine:
```bash
cd backend
npm install
npm start
```
*The backend will boot up on `http://localhost:5000` and securely connect to MongoDB.*

### Step 2: Start the Frontend (User Interface)
Open a **new, separate terminal**, navigate to the `frontend` folder, and launch Vite:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

### Step 3: Access the Application
Open your web browser (Chrome, Firefox, Safari) and go directly to:
👉 **http://localhost:5173**

---

## 🛠 Features Included
- **1,600+ Questions**: Programmatically seeded database covering DBMS, DSA, Java, C, Python, CN, COA, and OS.
- **Activity Heatmap**: A GitHub-style live streak tracking matrix.
- **Gamification**: XP, Levels, and Badges calculated asynchronously.
- **"Daily Quiz" Engine**: Mixes questions across all 8 CS subjects dynamically using MongoDB `$sample`.
- **Socratic AI Tutor**: Real-time Gemini-powered assistance to avoid plain answer-dumping.

## 📝 If You Meant "How to run code dynamically like LeetCode?"
Right now, Neural Decay Guard is specifically architected as an **MCQ-based conceptual tracking ecosystem**. 
To physically compile and run Java/Python code like LeetCode does (creating an actual Remote Code Execution engine), we would need to integrate a sandbox API like **Judge0** into the `Workspace.jsx`. Let me know if that is what you meant!
