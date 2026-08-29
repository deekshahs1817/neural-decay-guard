import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Leaderboard from "./pages/Leaderboard";
import Decay from "./pages/Decay";
import Recommendation from "./pages/Recommendation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/Profile";
import DailyQuiz from "./pages/DailyQuiz";
import FocusRoom from "./pages/FocusRoom";
import EnterpriseBoard from "./pages/EnterpriseBoard";
import EnterpriseLanding from "./pages/EnterpriseLanding";

// New DSA & Coding Practice Platform Pages
import CodingArena from "./pages/CodingArena";
import CodingWorkspace from "./pages/CodingWorkspace";
import DailyCodingChallenge from "./pages/DailyCodingChallenge";
import DSARoadmap from "./pages/DSARoadmap";

// New CSE Core Subjects Academy Pages
import CoreSubjects from "./pages/CoreSubjects";
import CourseDetail from "./pages/CourseDetail";

// Admin Judge Audit Dashboard
import JudgeAudit from "./pages/JudgeAudit";

import Layout from "./components/Layout";
import BackgroundBrain from "./components/BackgroundBrain";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <BackgroundBrain />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enterprise" element={<EnterpriseLanding />} />
        
        {/* Protected Routes inside Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* CSE Core Subjects Academy */}
          <Route path="/core-subjects" element={<CoreSubjects />} />
          <Route path="/core-subjects/:courseId" element={<CourseDetail />} />

          {/* Redirect /coding and /coding/:id to /daily-quiz */}
          <Route path="/coding" element={<Navigate to="/daily-quiz" replace />} />
          <Route path="/coding/:id" element={<Navigate to="/daily-quiz" replace />} />
          <Route path="/coding/*" element={<Navigate to="/daily-quiz" replace />} />
          <Route path="/daily-challenge" element={<DailyCodingChallenge />} />
          <Route path="/dsa-roadmap" element={<DSARoadmap />} />

          {/* Existing Preserved Routes */}
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/decay" element={<Decay />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/judge-audit" element={<JudgeAudit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/daily-quiz" element={<DailyQuiz />} />
          <Route path="/focus-room" element={<FocusRoom />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;