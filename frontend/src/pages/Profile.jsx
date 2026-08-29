import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { 
  Brain, Save, CheckCircle2, Search, Database, 
  Cpu, Network, Boxes, Binary, LayoutDashboard, Sparkles, 
  CheckCheck, CircleDot, Zap, Layers, RefreshCw
} from "lucide-react";

const KNOWLEDGE_CATEGORIES = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: Brain,
    topics: [
      "Arrays & Two Pointers",
      "Strings & Pattern Matching",
      "Linked Lists & Fast-Slow Pointers",
      "Stacks & Monotonic Stacks",
      "Queues & Deques",
      "Binary Trees & BST",
      "Heaps & Priority Queues",
      "Hash Maps & Hash Sets",
      "Recursion & Backtracking",
      "Dynamic Programming (1D & 2D)",
      "Graph Traversals (BFS & DFS)",
      "Shortest Path (Dijkstra, Bellman-Ford)",
      "Minimum Spanning Tree (Prim, Kruskal)",
      "Disjoint Set Union (Union Find)",
      "Tries & Prefix Trees",
      "Segment Trees & Fenwick Trees",
      "Binary Search & Monotonic Spaces",
      "Greedy Algorithms",
      "Sliding Window Technique",
      "Bit Manipulation & Math"
    ]
  },
  {
    id: "dbms",
    name: "Database Management Systems (DBMS)",
    icon: Database,
    topics: [
      "DBMS 3-Tier Architecture",
      "ER Modeling & Relational Schemas",
      "Relational Algebra & Tuple Calculus",
      "SQL DDL, DML & Key Constraints",
      "SQL Joins & Correlated Subqueries",
      "Functional Dependencies & Armstrong Axioms",
      "1NF, 2NF, 3NF Normalization",
      "Boyce-Codd Normal Form (BCNF)",
      "ACID Properties & Transaction States",
      "Conflict & View Serializability",
      "Strict & Rigorous 2-Phase Locking (2PL)",
      "Timestamp & Validation Protocols",
      "Deadlock Handling (Wait-Die, Wound-Wait)",
      "Dense vs Sparse Indexing",
      "B-Trees & B+ Tree Indexing",
      "Write-Ahead Logging (WAL) & ARIES Recovery",
      "NoSQL & CAP Theorem"
    ]
  },
  {
    id: "os",
    name: "Operating Systems (OS)",
    icon: Cpu,
    topics: [
      "Kernel Architecture & Dual-Mode Execution",
      "Process Lifecycle & Process Control Block (PCB)",
      "User-Level vs Kernel-Level Threads",
      "Inter-Process Communication (IPC & Pipes)",
      "CPU Scheduling (FCFS, SJF, SRTF, Round Robin)",
      "Critical Section Problem & Peterson's Algorithm",
      "Semaphores, Mutex & Spinlocks",
      "Classic Sync (Producer-Consumer, Dining Philosophers)",
      "Deadlock Characterization & Resource Allocation Graphs",
      "Deadlock Avoidance & Banker's Algorithm",
      "Contiguous Memory & Dynamic Partitioning",
      "Paging Hardware & Translation Lookaside Buffer (TLB)",
      "Segmentation Architecture",
      "Virtual Memory & Demand Paging",
      "Page Replacement (FIFO, Optimal, LRU, Clock)",
      "Thrashing & Working Set Model",
      "Disk Scheduling (SCAN, C-SCAN, LOOK, C-LOOK)",
      "Unix Inodes & File Allocation Methods"
    ]
  },
  {
    id: "cn",
    name: "Computer Networks (CN)",
    icon: Network,
    topics: [
      "OSI 7-Layer vs TCP/IP Reference Models",
      "Transmission Media & Nyquist/Shannon Capacity",
      "Framing & Bit/Byte Stuffing",
      "Error Detection (Parity, Checksum, CRC)",
      "Stop-and-Wait ARQ Protocol",
      "Sliding Window (Go-Back-N Protocol)",
      "Sliding Window (Selective Repeat Protocol)",
      "CSMA/CD (Carrier Sense & Collision Detection)",
      "IPv4 Header Architecture & Fragmentation",
      "Classful vs Classless (CIDR) Subnetting",
      "Address Resolution Protocol (ARP & RARP)",
      "ICMP Diagnostics (Ping & Traceroute)",
      "Distance Vector Routing (RIP & Bellman-Ford)",
      "Link State Routing (OSPF & Dijkstra)",
      "Border Gateway Protocol (BGP & Path Vector)",
      "UDP Architecture & Datagram Sockets",
      "TCP 3-Way Handshake & Connection Teardown",
      "TCP Congestion Control (Slow Start & AIMD)",
      "DNS Hierarchical Architecture",
      "HTTP/1.1 vs HTTP/2 vs HTTP/3",
      "SSL/TLS Handshake & Symmetric/Asymmetric Encryption"
    ]
  },
  {
    id: "coa",
    name: "Computer Organization & Architecture (COA)",
    icon: Cpu,
    topics: [
      "IEEE 754 Floating Point Representation",
      "Instruction Formats & Opcode Encoding",
      "Addressing Modes (Immediate, Direct, Indirect, Indexed)",
      "Hardwired vs Microprogrammed Control Units",
      "RISC vs CISC Architecture Differences",
      "Instruction Cycle & Register Transfer Language (RTL)",
      "5-Stage CPU Instruction Pipelining",
      "Pipeline Hazards (Structural, Data, Control)",
      "Operand Forwarding & Branch Prediction (BTB)",
      "Memory Hierarchy & Locality of Reference",
      "Direct Cache Mapping",
      "Fully Associative Cache Mapping",
      "K-Way Set Associative Cache Mapping",
      "Cache Misses (Compulsory, Capacity, Conflict)",
      "Write-Through vs Write-Back Policies",
      "Cache Replacement Algorithms (LRU, Pseudo-LRU)",
      "Average Memory Access Time (AMAT)",
      "Virtual Memory & Multi-Level Page Tables",
      "Direct Memory Access (DMA Transfer Modes)",
      "Flynn's Taxonomy & Multicore Cache Coherence"
    ]
  },
  {
    id: "oops",
    name: "Object-Oriented Programming & Design Patterns",
    icon: Boxes,
    topics: [
      "Encapsulation, Abstraction & Access Modifiers",
      "Constructors & Deep vs Shallow Copying",
      "Inheritance Types & Virtual Base Classes (Diamond Problem)",
      "Function Overloading & Operator Overloading",
      "Runtime Polymorphism, Virtual Functions & vtable Layout",
      "Pure Virtual Functions & Abstract Classes",
      "Interfaces & Multiple Interface Contracts",
      "Static vs Instance Members & Memory Layout",
      "Exception Handling Hierarchies & RAII",
      "Generics & Type Metaprogramming",
      "SOLID: Single Responsibility Principle (SRP)",
      "SOLID: Open/Closed Principle (OCP)",
      "SOLID: Liskov Substitution Principle (LSP)",
      "SOLID: Interface Segregation Principle (ISP)",
      "SOLID: Dependency Inversion Principle (DIP)",
      "Singleton Pattern & Double-Checked Locking",
      "Factory Method & Abstract Factory Patterns",
      "Builder & Prototype Patterns",
      "Adapter & Facade Patterns",
      "Decorator & Proxy Patterns",
      "Observer & Strategy Patterns",
      "Command & State Patterns"
    ]
  },
  {
    id: "toc",
    name: "Theory of Computation & Compiler Design",
    icon: Binary,
    topics: [
      "Alphabets, Strings & Kleene Star Operators",
      "Deterministic Finite Automata (DFA Construction)",
      "Non-Deterministic Finite Automata (NFA to DFA Subset)",
      "Minimization of DFA (Table Filling Algorithm)",
      "Regular Expressions & Arden's Theorem",
      "Pumping Lemma for Regular Languages",
      "Closure Properties of Regular Languages",
      "Context-Free Grammars (CFG) & Ambiguity",
      "Chomsky Hierarchy of Languages",
      "Chomsky Normal Form (CNF) & GNF",
      "Pushdown Automata (PDA & Stack Transitions)",
      "Pumping Lemma for Context-Free Languages",
      "Turing Machine Architecture & Halting Problem",
      "Decidability & Recursive Enumerable Sets",
      "Compiler Phases (Analysis vs Synthesis)",
      "Lexical Analysis, Tokens & Flex",
      "Eliminating Left Recursion & Left Factoring",
      "FIRST and FOLLOW Set Computation",
      "LL(1) Top-Down Parsing Tables",
      "Shift-Reduce & LR(0) Parsing DFA",
      "SLR(1), CLR(1) & LALR(1) Parsing",
      "Syntax-Directed Translation (SDT & Attributes)",
      "Three-Address Code (TAC) & Code Optimization"
    ]
  },
  {
    id: "se",
    name: "Software Engineering & System Design",
    icon: LayoutDashboard,
    topics: [
      "SDLC Phases (Waterfall, Spiral, Agile Scrum)",
      "Functional vs Non-Functional Requirements (SRS)",
      "COCOMO Software Cost Estimation",
      "High Cohesion & Low Coupling Principles",
      "UML Modeling (Class, Sequence, State Diagrams)",
      "Cyclomatic Complexity & White-Box Basis Path Testing",
      "Black-Box Testing (Equivalence & Boundary Value)",
      "Vertical vs Horizontal Scalability Tradeoffs",
      "Load Balancers (Round Robin, Least Conn, Consistent Hash)",
      "Caching Strategies (Write-Through, Write-Back, Cache-Aside)",
      "Database Replication (Primary-Replica & Read Replicas)",
      "Database Sharding & Partitioning",
      "Consistent Hashing & Virtual Nodes",
      "CAP Theorem & PACELC Theorem",
      "Message Brokers (Kafka, RabbitMQ, Pub/Sub)",
      "Microservices Architecture & API Gateways",
      "REST vs GraphQL vs gRPC API Architecture",
      "Rate Limiting (Token Bucket, Leaky Bucket, Sliding Window)",
      "Distributed Consensus (Raft & Paxos)",
      "High-Level System Design (URL Shortener, Chat System)"
    ]
  }
];

export default function Profile() {
  const userId = localStorage.getItem("userId");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    API.get(`/userStats/${userId}`)
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const setTopicStatus = (topic, targetStatus) => {
    // targetStatus: 'mastered' | 'learning' | 'none'
    setStats(prev => {
      let mastered = [...(prev.masteredTopics || [])];
      let learning = [...(prev.learningTopics || [])];

      // Remove from both first
      mastered = mastered.filter(t => t !== topic);
      learning = learning.filter(t => t !== topic);

      if (targetStatus === "mastered") {
        mastered.push(topic);
      } else if (targetStatus === "learning") {
        learning.push(topic);
      }

      return {
        ...prev,
        masteredTopics: mastered,
        learningTopics: learning
      };
    });
  };

  const setCategoryStatusAll = (categoryTopics, targetStatus) => {
    setStats(prev => {
      let mastered = new Set(prev.masteredTopics || []);
      let learning = new Set(prev.learningTopics || []);

      categoryTopics.forEach(t => {
        mastered.delete(t);
        learning.delete(t);
        if (targetStatus === "mastered") mastered.add(t);
        if (targetStatus === "learning") learning.add(t);
      });

      return {
        ...prev,
        masteredTopics: Array.from(mastered),
        learningTopics: Array.from(learning)
      };
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await API.put(`/userStats/${userId}/profile`, {
        masteredTopics: stats.masteredTopics || [],
        learningTopics: stats.learningTopics || []
      });
      setSaveMsg("Profile Synchronized with Retention Engine ✓");
    } catch (err) {
      setSaveMsg("Sync Failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  };

  const filteredCategories = useMemo(() => {
    let cats = KNOWLEDGE_CATEGORIES;
    if (activeCategory !== "all") {
      cats = cats.filter(c => c.id === activeCategory);
    }

    if (!searchQuery.trim()) return cats;

    const q = searchQuery.toLowerCase();
    return cats.map(cat => ({
      ...cat,
      topics: cat.topics.filter(t => t.toLowerCase().includes(q))
    })).filter(cat => cat.topics.length > 0);
  }, [activeCategory, searchQuery]);

  const masteredCount = stats?.masteredTopics?.length || 0;
  const learningCount = stats?.learningTopics?.length || 0;

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="pro-text-muted text-xs font-bold">Synchronizing Knowledge Profile Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-black uppercase">
              <Brain size={14} /> Cognitive Skill Retention Engine
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              Knowledge <span className="text-[var(--accent-primary)]">Profile</span>
            </h1>
            <p className="pro-text-muted text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Mark topics as <strong>Mastered (✓)</strong> to activate Ebbinghaus decay tracking & Daily Retention Quizzes, or <strong>Learning (⚡)</strong> to prioritize them in your recommendations.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-3.5 shadow-sm flex-1 md:flex-initial">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Mastered (Retention)</span>
                <p className="text-2xl font-black font-mono text-emerald-500">
                  {masteredCount} <span className="text-xs font-normal pro-text-muted">Topics</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-3.5 shadow-sm flex-1 md:flex-initial">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Learning Focus</span>
                <p className="text-2xl font-black font-mono text-cyan-400">
                  {learningCount} <span className="text-xs font-normal pro-text-muted">Topics</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 border-[var(--border-color)] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, algorithms, protocols..."
              className="input-field !pl-10 !py-2.5 text-xs font-medium w-full rounded-xl bg-[var(--bg-secondary)] border-[var(--border-color)]"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {saveMsg && (
              <span className="text-[11px] font-bold text-emerald-400 animate-pulse font-mono">
                {saveMsg}
              </span>
            )}
            <button
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary !px-6 !py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Save size={15} className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Saving..." : "Save Knowledge Profile"}</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeCategory === "all"
                ? "bg-[var(--accent-primary)] text-white font-black shadow-sm"
                : "bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main"
            }`}
          >
            All Disciplines
          </button>
          {KNOWLEDGE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCategory === cat.id
                  ? "bg-[var(--accent-primary)] text-white font-black shadow-sm"
                  : "bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main"
              }`}
            >
              <cat.icon size={13} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Unified Single Grid (No Duplicates) */}
      <div className="space-y-6">
        {filteredCategories.map(cat => (
          <div key={cat.id} className="glass-panel p-6 border-[var(--border-color)] space-y-4 shadow-sm">
            {/* Category Header with Batch Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent-glow)] text-[var(--accent-primary)]">
                  <cat.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase pro-text-main tracking-wider">{cat.name}</h3>
                  <span className="text-[10px] pro-text-muted font-mono">{cat.topics.length} Core Concepts</span>
                </div>
              </div>

              {/* Batch Actions */}
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <button
                  onClick={() => setCategoryStatusAll(cat.topics, "mastered")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1"
                  title="Mark all as Mastered"
                >
                  <CheckCheck size={12} /> Mark All Mastered
                </button>
                <button
                  onClick={() => setCategoryStatusAll(cat.topics, "learning")}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition flex items-center gap-1"
                  title="Mark all as Learning"
                >
                  <Zap size={12} /> Mark All Learning
                </button>
                <button
                  onClick={() => setCategoryStatusAll(cat.topics, "none")}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] pro-text-muted border border-[var(--border-color)] transition"
                  title="Reset Category"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Unified Topic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.topics.map(topic => {
                const isMastered = stats?.masteredTopics?.includes(topic);
                const isLearning = stats?.learningTopics?.includes(topic);

                return (
                  <div
                    key={topic}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isMastered
                        ? "bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                        : isLearning
                        ? "bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                        : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-bold leading-snug ${
                        isMastered ? "text-emerald-400" : isLearning ? "text-cyan-300" : "pro-text-main"
                      }`}>
                        {topic}
                      </span>
                    </div>

                    {/* 3-State Action Segment Selector */}
                    <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
                      <button
                        onClick={() => setTopicStatus(topic, isMastered ? "none" : "mastered")}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase transition flex items-center justify-center gap-1 ${
                          isMastered
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "pro-text-muted hover:text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        <span>Mastered</span>
                      </button>

                      <button
                        onClick={() => setTopicStatus(topic, isLearning ? "none" : "learning")}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase transition flex items-center justify-center gap-1 ${
                          isLearning
                            ? "bg-cyan-400 text-slate-950 shadow-sm"
                            : "pro-text-muted hover:text-cyan-300 hover:bg-cyan-500/10"
                        }`}
                      >
                        <Zap size={12} />
                        <span>Learning</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Save Footer */}
      <div className="sticky bottom-6 z-30 p-4 bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] rounded-3xl shadow-2xl flex items-center justify-between max-w-xl mx-auto">
        <div className="space-y-0.5">
          <p className="text-xs font-black uppercase pro-text-main">
            {masteredCount} Mastered • {learningCount} Learning Focus
          </p>
          <p className="text-[10px] pro-text-muted">Click save to update your Daily Retention Quiz algorithms.</p>
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="btn-primary !px-8 !py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl"
        >
          <Save size={15} className={saving ? "animate-spin" : ""} />
          <span>{saving ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>
    </div>
  );
}
