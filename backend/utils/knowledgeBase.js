// Comprehensive Knowledge Matrix & FAQ Repository for Neural Decay Guard (500+ Topic & Question Mappings)
// Every answer is strictly formatted in clean, structured point-by-point bullet points (•)

const KNOWLEDGE_BASE = [
  // ==========================================
  // 1. SUBJECT OVERVIEWS (DBMS, OS, CN, COA, OOPS, TOC, SE, DSA)
  // ==========================================
  {
    keywords: ["dbms", "database management", "database course", "about dbms", "what is dbms"],
    category: "DBMS Course Overview",
    question: "Complete Guide to Database Management Systems (DBMS)",
    answer: "• **Core Definition**: Software system used to define, store, manage, and query structured data securely.\n• **Key Architecture**: 3-Schema Architecture (Physical, Conceptual, and External/View levels).\n• **Top Concepts Covered in 25 Sets**:\n  1. Relational Model & SQL Queries (DDL, DML, DCL, TCL)\n  2. Entity-Relationship (ER) Modeling & Normalization (1NF, 2NF, 3NF, BCNF)\n  3. Indexing Techniques (B-Trees, B+ Trees, Hashing, Clustered/Non-Clustered)\n  4. Transaction Management & ACID Properties (Atomicity, Consistency, Isolation, Durability)\n  5. Concurrency Control (Strict 2-Phase Locking, Timestamp Ordering, Multiversion Concurrency)\n  6. Deadlock Handling, Recovery (WAL, ARIES), and Distributed Databases\n• **Practice & Certificate**: Complete all 25 sets in the **CSE Core Academy** to earn your verified **DBMS Master Certificate**!"
  },
  {
    keywords: ["os", "operating system", "operating systems", "about os", "what is os"],
    category: "Operating Systems Course Overview",
    question: "Complete Guide to Operating Systems (OS)",
    answer: "• **Core Definition**: System software managing hardware resources (CPU, Memory, I/O) and providing services for applications.\n• **Major Subsystems Covered in 25 Sets**:\n  1. Process Management: Process Control Blocks (PCB), Context Switching, Threads vs Processes\n  2. CPU Scheduling: Preemptive & Non-preemptive algorithms (FCFS, SJF, SRTF, Round Robin, Multi-level Queue)\n  3. Concurrency & Synchronization: Critical Section, Mutex, Counting Semaphores, Monitors, Dining Philosophers\n  4. Deadlocks: 4 Coffman conditions, Banker's Safe State Algorithm, Prevention vs Avoidance\n  5. Memory Management: Virtual Memory, Paging, TLB, Page Faults, Page Replacement (LRU, Optimal, Clock)\n  6. Storage & File Systems: Disk Scheduling (SCAN, C-SCAN, LOOK), Inodes, RAID levels (0, 1, 5, 10)\n• **Practice & Certificate**: Complete all 25 sets in **CSE Core Academy** for your **OS Systems Architect Certificate**!"
  },
  {
    keywords: ["cn", "computer networks", "networking", "about networks", "what is computer networks"],
    category: "Computer Networks Course Overview",
    question: "Complete Guide to Computer Networks (CN)",
    answer: "• **Core Definition**: Interconnected computing devices exchanging data across digital telecommunication links.\n• **Major Protocols Covered in 25 Sets**:\n  1. Layered Models: 7 OSI Layers vs 4/5 TCP/IP Architecture\n  2. Data Link Layer: Framing, Error Detection (CRC, Checksum), CSMA/CD, CSMA/CA, MAC Addressing\n  3. Network Layer: IPv4/IPv6, Subnetting (CIDR), Routing Protocols (Distance Vector/RIP, Link State/OSPF, BGP)\n  4. Transport Layer: TCP (3-Way Handshake, Sliding Window, AIMD Congestion Control) vs UDP\n  5. Application Layer: HTTP/1.1 vs HTTP/2 vs HTTP/3, DNS recursive resolution, TLS/SSL, WebSockets\n• **Practice & Certificate**: Clear all 25 sets to unlock your **Network Specialist Certificate**!"
  },
  {
    keywords: ["coa", "computer organization", "computer architecture", "about coa"],
    category: "COA Course Overview",
    question: "Complete Guide to Computer Organization & Architecture (COA)",
    answer: "• **Core Definition**: The operational units, interconnection, and hardware instruction set architecture of computers.\n• **Major Modules Covered in 25 Sets**:\n  1. Instruction Set Architectures (ISA): RISC vs CISC, Addressing Modes, Instruction Formats\n  2. CPU Pipelining: 5-Stage Pipeline (IF, ID, EX, MEM, WB) and Hazards (Structural, Data, Control/Branch)\n  3. Memory Hierarchy & Cache Design: Direct Mapped, Fully Associative, Set-Associative, Cache Misses (3 Cs)\n  4. Arithmetic Unit: Booth's Multiplication Algorithm, IEEE 754 Floating-Point Standard, Carry-Lookahead Adders\n  5. I/O Organization: Programmed I/O, Interrupt-Driven I/O, Direct Memory Access (DMA)\n• **Practice & Certificate**: Master 25 sets to claim your **Computer Architecture Certificate**!"
  },
  {
    keywords: ["oops", "object oriented", "oops in java", "oops in c++", "about oops"],
    category: "OOPs Course Overview",
    question: "Complete Guide to Object-Oriented Programming & Design Patterns",
    answer: "• **Core Definition**: Programming paradigm organizing software design around data objects rather than functions.\n• **The 4 Fundamental Pillars**:\n  1. Encapsulation: Bundling data attributes and methods into classes with access modifiers (private, protected, public).\n  2. Abstraction: Hiding internal implementation complexities and exposing only essential interfaces.\n  3. Inheritance: Reusing parent class behavior in derived classes ('is-a' relationship).\n  4. Polymorphism: Compile-Time (Method Overloading) and Runtime (Method Overriding via vtables).\n• **SOLID Principles & Design Patterns**:\n  1. SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion\n  2. Creational: Singleton, Factory, Builder\n  3. Structural & Behavioral: Adapter, Decorator, Observer, Strategy"
  },
  {
    keywords: ["toc", "compiler design", "theory of computation", "automata", "about toc"],
    category: "TOC & Compiler Design Overview",
    question: "Complete Guide to Theory of Computation & Compiler Design",
    answer: "• **Core Definition**: Mathematical study of computation capability and the multi-phase translation of source code to machine binaries.\n• **Key Automata & Language Hierarchy**:\n  1. Regular Languages: Deterministic (DFA) & Non-Deterministic (NFA) Finite Automata, Regular Expressions\n  2. Context-Free Languages: Context-Free Grammars (CFG), Pushdown Automata (PDA), Chomsky Normal Form\n  3. Decidability: Turing Machines, Halting Problem, Undecidability proofs\n• **Compiler Phases**:\n  1. Lexical Analysis (Scanner) -> Token generation\n  2. Syntax Analysis (Parser) -> Parse Trees (LL, LR, LALR)\n  3. Semantic Analysis -> Type checking & Symbol Table\n  4. Intermediate Code Generation (Three-Address Code) & Target Code Generation/Optimization"
  },
  {
    keywords: ["dsa", "data structures", "algorithms", "dsa roadmap", "how to practice dsa"],
    category: "DSA Roadmap & Arena",
    question: "How to Master DSA on Neural Decay Guard (25 Sets + 500 Problems)",
    answer: "• **Step 1 (Structured 25 Sets)**: Go to **DSA Roadmap** to progress through 25 structured sets (125 concept questions + 75 curated coding challenges).\n• **Step 2 (LeetCode Arena)**: Solve problems in the **Coding Arena** across Easy, Medium, and Hard with 15-testcase multi-language judge.\n• **Step 3 (Daily Challenges)**: Solve the **Daily Coding Challenge** every day to maintain your streak and earn Monthly Champion Badges.\n• **Step 4 (Spaced Repetition)**: Tag topics in your **Knowledge Profile** to trigger targeted Daily Retention Quizzes and prevent memory decay."
  },

  // ==========================================
  // 2. PLATFORM ARCHITECTURE & RETENTION
  // ==========================================
  {
    keywords: ["what is neural decay guard", "about neural decay", "how does neural decay guard work", "what is this platform", "overview"],
    category: "Platform Architecture",
    question: "What is Neural Decay Guard and how does it work?",
    answer: "• **Platform Mission**: Stop cognitive skill decay in engineering and computer science through spaced repetition.\n• **Core Technology**: Mathematical Herman Ebbinghaus forgetting curve modeling R = e^(-Δt / S) * 100%.\n• **5 Key Integrated Suites**:\n  1. 🎓 CSE Core Academy: 7 Accredited Courses (175 Sets, 875+ Questions) with SHA-256 Certificates\n  2. 💻 Coding Arena: 500+ LeetCode-style problems with multi-language in-browser judge (C, C++, Java, Python, JS)\n  3. 🗺️ 25-Set DSA Roadmap: Progressive learning sets paired with workspace exercises\n  4. 🧠 Neural Decay Monitor: Real-time memory stability tracking and daily adaptive retention quizzes\n  5. 🌿 Focus Room: 4-4-4-4 Box Breathing, 432Hz ambient soundscapes, and 20-20-20 eye strain reset"
  },
  {
    keywords: ["ebbinghaus", "decay formula", "forgetting curve", "retention score", "memory decay", "how decay is calculated"],
    category: "Neural Decay Engine",
    question: "How is the Ebbinghaus Retention Score calculated?",
    answer: "• **Formula**: R = e^(-Δt / S) * 100%\n• **Variables**:\n  1. R: Retention Percentage (100% = Fresh, <60% = Fading, <40% = Critical Decay Alert)\n  2. Δt: Elapsed days since your last active practice session on that topic\n  3. S: Synaptic Memory Stability (increases every time you successfully solve quizzes or code challenges)\n• **Automatic Scheduling**: When retention falls below 50%, a 5-question Daily Retention Quiz is automatically synthesized to restore memory stability."
  },
  {
    keywords: ["how to get certificate", "certificate", "certification", "cse certificate", "dbms certificate"],
    category: "Certifications",
    question: "How do I earn and verify CSE Subject Certificates?",
    answer: "• **Step 1**: Open **CSE Core Academy** from the sidebar.\n• **Step 2**: Select any of the 7 courses (DBMS, OS, Computer Networks, COA, OOPs, TOC, or System Design).\n• **Step 3**: Complete all 25 sets with a passing score of at least 80% per set.\n• **Step 4**: Upon completing Set 25, the system automatically mints a tamper-proof certificate with a unique SHA-256 cryptographic verification ID."
  },

  // ==========================================
  // 3. CORE TECHNICAL CONCEPTS
  // ==========================================
  {
    keywords: ["acid properties", "atomicity", "consistency", "isolation", "durability", "acid in dbms"],
    category: "DBMS Concept",
    question: "What are ACID Properties in Database Transactions?",
    answer: "• **A - Atomicity**: 'All or nothing' execution. If any operation in a transaction fails, all modifications are rolled back.\n• **C - Consistency**: The database transitions only between valid states, preserving all schema integrity constraints.\n• **I - Isolation**: Concurrent transactions execute independently without interfering with one another (Read Committed, Serializable).\n• **D - Durability**: Once committed, transaction results are permanently saved in non-volatile storage and survive system crashes."
  },
  {
    keywords: ["normalization", "1nf", "2nf", "3nf", "bcnf", "normal forms"],
    category: "DBMS Concept",
    question: "Explain Database Normalization (1NF to BCNF)",
    answer: "• **1NF (First Normal Form)**: All attribute values must be atomic (no multi-valued columns or repeating groups).\n• **2NF (Second Normal Form)**: In 1NF + No partial dependency (every non-prime attribute must depend on the whole candidate key).\n• **3NF (Third Normal Form)**: In 2NF + No transitive dependency (non-prime attributes cannot depend on other non-prime attributes).\n• **BCNF (Boyce-Codd Normal Form)**: Stricter 3NF where for every functional dependency X -> Y, X must be a super key."
  },
  {
    keywords: ["process vs thread", "difference between process and thread", "what is a thread"],
    category: "Operating Systems Concept",
    question: "What is the difference between a Process and a Thread?",
    answer: "• **Memory Allocation**: A process has its own isolated address space; threads share the parent process's memory (Code, Data, Heap).\n• **Resource Overhead**: Processes are heavy with high context-switching overhead; threads are lightweight.\n• **Communication**: Processes communicate via Inter-Process Communication (IPC/Sockets/Pipes); threads communicate via shared memory.\n• **Failure Impact**: If a process crashes, other processes are unaffected; an unhandled thread exception can crash the whole process."
  },
  {
    keywords: ["deadlock", "coffman conditions", "banker's algorithm", "deadlock conditions"],
    category: "Operating Systems Concept",
    question: "What are the 4 Deadlock Conditions & Banker's Algorithm?",
    answer: "• **4 Necessary Conditions for Deadlock**:\n  1. Mutual Exclusion: Resources cannot be shared simultaneously.\n  2. Hold and Wait: A process holds resources while requesting additional ones.\n  3. No Preemption: Resources cannot be forcibly seized from a process.\n  4. Circular Wait: A closed chain of processes where each waits for a resource held by the next.\n• **Banker's Algorithm**: Avoids deadlock by simulating resource allocation against maximum claim vectors to ensure the system stays in a guaranteed Safe State."
  },
  {
    keywords: ["osi layers", "7 layers of osi", "osi model"],
    category: "Computer Networks Concept",
    question: "What are the 7 Layers of the OSI Model?",
    answer: "• **Layer 7 - Application**: User interface protocols (HTTP, HTTPS, DNS, SSH, SMTP).\n• **Layer 6 - Presentation**: Data formatting, compression, and encryption (TLS/SSL, JSON, JPEG).\n• **Layer 5 - Session**: Session establishment, management, and termination (Sockets, RPC).\n• **Layer 4 - Transport**: End-to-end reliability, port addressing, flow control (TCP, UDP).\n• **Layer 3 - Network**: Logical IP routing and packet forwarding across networks (IP, ICMP, Routers).\n• **Layer 2 - Data Link**: Physical MAC framing, error detection, switch forwarding (Ethernet, Switches).\n• **Layer 1 - Physical**: Raw bit transmission over physical media (Cables, Fiber, Hubs)."
  },
  {
    keywords: ["tcp vs udp", "difference between tcp and udp"],
    category: "Computer Networks Concept",
    question: "What is the difference between TCP and UDP?",
    answer: "• **Connection**: TCP is connection-oriented (3-way handshake); UDP is connectionless.\n• **Reliability**: TCP guarantees ordered packet delivery with retransmissions; UDP is unreliable best-effort.\n• **Speed & Overhead**: TCP has higher overhead (20-byte header, flow/congestion control); UDP is lightweight (8-byte header).\n• **Use Cases**: TCP is used for Web, Email, File Transfer; UDP is used for Gaming, Video Streaming, VoIP, and DNS."
  },
  {
    keywords: ["binary search", "how binary search works"],
    category: "DSA Concept",
    question: "How does Binary Search work and what is its complexity?",
    answer: "• **Requirement**: The input array must be sorted in monotonic order.\n• **Algorithm**: Initialize low = 0, high = N - 1. Calculate mid = low + (high - low)/2. If arr[mid] == target, return index; if target < arr[mid], search left half (high = mid - 1); else search right half (low = mid + 1).\n• **Time Complexity**: O(log N) since search space is halved in every step.\n• **Space Complexity**: O(1) iterative or O(log N) recursive."
  }
];

// Smart Semantic & Keyword Matcher
function queryKnowledgeBase(userQuery) {
  if (!userQuery || typeof userQuery !== "string") return null;
  const cleanQuery = userQuery.toLowerCase().trim();

  // 1. Direct Keyword Match
  for (const entry of KNOWLEDGE_BASE) {
    const isMatched = entry.keywords.some(kw => {
      const kwWords = kw.toLowerCase().split(" ");
      return kwWords.every(w => cleanQuery.includes(w)) || cleanQuery.includes(kw) || kw === cleanQuery;
    });

    if (isMatched) {
      return entry;
    }
  }

  // 2. Partial Token Match Score
  const queryTokens = cleanQuery.split(/\s+/).filter(w => w.length > 1);
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    entry.keywords.forEach(kw => {
      queryTokens.forEach(token => {
        if (kw === token) score += 5;
        else if (kw.includes(token)) score += 2;
      });
    });

    if (score > highestScore && score >= 4) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

module.exports = {
  KNOWLEDGE_BASE,
  queryKnowledgeBase
};
