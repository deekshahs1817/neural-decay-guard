import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  GraduationCap, Database, Cpu, Network, Boxes, Binary, 
  LayoutDashboard, Award, CheckCircle2, ArrowRight, Shield, 
  Sparkles, BookOpen, Clock, Trophy
} from "lucide-react";
import CertificateModal from "../components/CertificateModal";

const ICON_MAP = {
  Database: Database,
  Cpu: Cpu,
  Network: Network,
  Boxes: Boxes,
  Binary: Binary,
  LayoutDashboard: LayoutDashboard,
  BookOpen: BookOpen
};

export default function CoreSubjects() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCertificate, setActiveCertificate] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/core-subjects", { params: { userId } });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load core courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewCertificate = async (certificateId) => {
    try {
      const res = await API.get(`/core-subjects/certificate/${certificateId}`);
      setActiveCertificate(res.data);
    } catch (err) {
      console.error("Failed to load certificate:", err);
    }
  };

  const totalCompletedSets = courses.reduce((acc, c) => acc + (c.completedSetsCount || 0), 0);
  const certificatesCount = courses.filter(c => c.isCertified).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Academy Header Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-black uppercase">
              <GraduationCap size={15} /> Computer Science Engineering Core Academy
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              CSE Core <span className="text-[var(--accent-primary)]">Subjects</span>
            </h1>
            <p className="pro-text-muted text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Master the foundational pillars of Computer Science. Each course features <strong>25 structured sets (125 core questions)</strong> with concept notes and an official <strong>Certificate of Mastery</strong> upon 100% completion.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4">
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] text-[var(--accent-primary)] flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Sets Mastered</span>
                <p className="text-2xl font-black font-mono pro-text-main">
                  {totalCompletedSets} <span className="text-xs font-normal pro-text-muted">/ 175</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Certificates</span>
                <p className="text-2xl font-black font-mono text-amber-500">
                  {certificatesCount} <span className="text-xs font-normal pro-text-muted">/ 7</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center pro-text-muted font-bold">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading CSE Core Subject Courses...
          </div>
        ) : (
          courses.map(course => {
            const IconComponent = ICON_MAP[course.icon] || BookOpen;
            return (
              <div 
                key={course.courseId}
                className={`glass-card border-[var(--border-color)] p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:border-[var(--accent-primary)] shadow-sm relative overflow-hidden group ${
                  course.isCertified ? "border-amber-500/40 bg-amber-500/[0.02]" : ""
                }`}
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                      <IconComponent size={24} />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted">
                        {course.code}
                      </span>
                      {course.isCertified && (
                        <span className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Award size={11} /> Certified
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--accent-primary)] block">
                    {course.category}
                  </span>
                  <h3 className="text-xl font-black pro-text-main mt-0.5 tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="pro-text-muted text-xs font-medium mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {course.topicsCovered?.slice(0, 4).map((topic, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted">
                        {topic}
                      </span>
                    ))}
                    {course.topicsCovered?.length > 4 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] pro-text-muted">
                        +{course.topicsCovered.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="pro-text-muted">Progress</span>
                    <span className="pro-text-main font-mono">
                      {course.completedSetsCount || 0} / {course.totalSets} Sets ({course.progressPercent || 0}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        course.isCertified ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]"
                      }`}
                      style={{ width: `${course.progressPercent || 0}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/core-subjects/${course.courseId}`}
                      className="btn-primary flex-1 !py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>{course.completedSetsCount > 0 ? "Continue Course" : "Start Course"}</span>
                      <ArrowRight size={14} />
                    </Link>

                    {course.isCertified && course.certificateId && (
                      <button
                        onClick={() => viewCertificate(course.certificateId)}
                        className="px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-black uppercase transition flex items-center gap-1"
                        title="View Certificate"
                      >
                        <Award size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Certificate Modal */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}
