import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, RefreshCw, 
  Search, Filter, Database, Cpu, Layers, Award, BarChart3, Terminal
} from "lucide-react";

export default function JudgeAudit() {
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHealth, setFilterHealth] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/admin/judge-audit", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditData(res.data);
    } catch (err) {
      console.error("Failed to load audit report:", err);
      setError(err.response?.data?.message || "Failed to load audit report");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      setRunningAudit(true);
      await fetchAuditData();
    } finally {
      setRunningAudit(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const filteredProblems = auditData?.problemReports?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = filterHealth === "all" ? true :
                          filterHealth === "healthy" ? p.isHealthy : !p.isHealthy;
    const matchesCategory = filterCategory === "all" ? true : p.category === filterCategory;
    return matchesSearch && matchesHealth && matchesCategory;
  }) || [];

  const categories = Array.from(new Set(auditData?.problemReports?.map(p => p.category) || []));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  Online Judge Engine Audit
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-medium">
                    PRODUCTION GRADE
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Automated differential correctness, anti-duplicate collision scanner & multi-language execution telemetry
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={runningAudit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition shadow-lg shadow-purple-900/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${runningAudit ? "animate-spin" : ""}`} />
              {runningAudit ? "Auditing 260 Problems..." : "Run Full Judge Audit Suite"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        {auditData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Judge Health Score</span>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black mt-2 text-emerald-400 font-mono">
                {auditData.healthScore}%
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{auditData.healthyProblems} / {auditData.totalProblems} verified accurate</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Test Cases Audited</span>
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black mt-2 text-cyan-400 font-mono">
                {auditData.totalTests.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Exactly 15 tests per problem (3 Basic + 5 Medium + 7 Hard)
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Duplicate Suite Rate</span>
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-black mt-2 text-purple-400 font-mono">
                {auditData.duplicateRate}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{auditData.duplicateProblemsCount} duplicates detected</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sandbox Engines</span>
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xl font-bold mt-3 text-white">
                5 Active Compilers
              </div>
              <div className="text-xs text-slate-400 mt-1">
                C, C++ (GCC 12), Java 17, Python 3.11, JavaScript
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems by title or slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Health:</span>
              <select
                value={filterHealth}
                onChange={e => setFilterHealth(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All ({auditData?.problemReports?.length || 0})</option>
                <option value="healthy">Healthy ({auditData?.healthyProblems || 0})</option>
                <option value="failed">Failed ({auditData?.failedProblems || 0})</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Category:</span>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Topics</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problem Diagnostic Table */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Problem Verification Matrix ({filteredProblems.length} problems shown)
            </h3>
            <span className="text-xs text-slate-500">
              Updated: {auditData?.timestamp ? new Date(auditData.timestamp).toLocaleTimeString() : "--"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3.5 px-4">Problem</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4 text-center">Tests</th>
                  <th className="py-3.5 px-4">Reference Solver</th>
                  <th className="py-3.5 px-4 text-center">Wrong Code Block</th>
                  <th className="py-3.5 px-4 text-center">Foreign Syntax Block</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-400 mb-2" />
                      Auditing Judge Engine across 260 problem suites...
                    </td>
                  </tr>
                ) : filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500">
                      No problems match your current search/filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((prob, idx) => (
                    <tr key={prob.problemId || idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                        <div className="font-medium text-white">{prob.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{prob.slug}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-sans">{prob.category}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                          prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-cyan-400 font-bold">
                        {prob.testCaseCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                          prob.positivePassRate === 100 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}>
                          {prob.positivePassRate === 100 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {prob.positiveVerdict}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {prob.negativeCheckPassed ? (
                          <span className="text-emerald-400 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Blocked
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center justify-center gap-1">
                            <XCircle className="w-4 h-4" /> Leaked
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {prob.foreignRejected ? (
                          <span className="text-emerald-400 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Blocked
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center justify-center gap-1">
                            <XCircle className="w-4 h-4" /> Leaked
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {prob.isHealthy ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-sans font-bold text-[11px]">
                            HEALTHY
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-sans font-bold text-[11px]">
                            ACTION REQ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
