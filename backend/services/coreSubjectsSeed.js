const CoreSubjectCourse = require("../models/CoreSubjectCourse");

// Subject Meta Definitions
const CSE_COURSES = [
  {
    courseId: "dbms",
    title: "Database Management Systems",
    code: "CS-301",
    category: "Data Engineering & Systems",
    icon: "Database",
    description: "Master Relational Databases, SQL DDL/DML, Normalization (1NF to BCNF), ACID Transactions, Indexing, B+ Trees, Concurrency Control, and Query Optimization.",
    certificateTitle: "Mastery Certification in Database Management Systems (DBMS)",
    topicsCovered: ["ER Modeling", "Relational Algebra", "SQL Queries & Joins", "Normalization", "ACID Transactions", "Concurrency Control", "Indexing & B+ Trees", "NoSQL Architecture"],
    setArchetypes: [
      { title: "Introduction to DBMS & Architecture", focus: "3-tier architecture, data abstraction, DBMS vs File System" },
      { title: "ER Diagrams & Relational Modeling", focus: "Entities, Relationships, Cardinality, Primary/Foreign Keys" },
      { title: "Relational Algebra Fundamentals", focus: "Selection, Projection, Cartesian Product, Joins, Set Operations" },
      { title: "Advanced Relational Algebra & Calculus", focus: "Division operator, Tuple Relational Calculus, Domain Calculus" },
      { title: "Basic SQL Queries & DDL Statements", focus: "CREATE, ALTER, DROP, TRUNCATE, Constraints, Primary/Foreign Keys" },
      { title: "Advanced SQL DML & Aggregate Functions", focus: "COUNT, SUM, AVG, GROUP BY, HAVING, ORDER BY" },
      { title: "Complex SQL Joins & Subqueries", focus: "INNER, LEFT, RIGHT, FULL OUTER, Self Join, Correlated Subqueries" },
      { title: "SQL Views, Triggers & Stored Procedures", focus: "Materialized Views, INSTEAD OF triggers, Procedural SQL" },
      { title: "Functional Dependencies", focus: "Armstrong's Axioms, Closure of attributes, Canonical Cover" },
      { title: "First, Second & Third Normal Forms", focus: "1NF (atomicity), 2NF (partial dependency), 3NF (transitive dependency)" },
      { title: "Boyce-Codd Normal Form (BCNF)", focus: "BCNF condition (LHS superkey), Dependency Preservation vs Lossless Join" },
      { title: "Multi-valued & Join Dependencies (4NF, 5NF)", focus: "4NF multi-valued dependencies, 5NF project-join normal form" },
      { title: "Transaction Management & ACID Properties", focus: "Atomicity, Consistency, Isolation, Durability" },
      { title: "Transaction States & Schedules", focus: "Active, Partially Committed, Committed, Failed, Aborted states" },
      { title: "Conflict & View Serializability", focus: "Precedence Graph, Swap rules, View Equivalence, Polygraph" },
      { title: "Recoverability & Cascading Rollbacks", focus: "Recoverable schedules, Cascadeless schedules, Strict schedules" },
      { title: "Lock-Based Concurrency Protocols", focus: "Shared vs Exclusive locks, 2-Phase Locking (2PL), Strict 2PL, Rigorous 2PL" },
      { title: "Timestamp & Validation Protocols", focus: "Thomas Write Rule, Read/Write timestamps, Optimistic Concurrency" },
      { title: "Deadlock Handling in DBMS", focus: "Wait-Die, Wound-Wait schemes, Deadlock Detection & Recovery" },
      { title: "File Organization & Record Storage", focus: "Heap files, Sequential files, Hashing techniques, Extendible Hashing" },
      { title: "Indexing Mechanics & Primary/Secondary Index", focus: "Dense vs Sparse Index, Clustered vs Non-Clustered index" },
      { title: "B-Trees & B+ Trees in Databases", focus: "Node structure, Search/Insert/Delete complexity, Leaf node linked lists" },
      { title: "Query Processing & Cost Estimation", focus: "Query parser, Query tree optimization, Relational algebra equivalence" },
      { title: "Database Recovery Techniques", focus: "Log-based recovery, WAL (Write-Ahead Logging), Checkpointing, ARIES algorithm" },
      { title: "Modern NoSQL & Distributed Databases", focus: "CAP Theorem, BASE properties, Document, Key-Value, Columnar, Graph stores" }
    ]
  },
  {
    courseId: "os",
    title: "Operating Systems",
    code: "CS-302",
    category: "Systems & Infrastructure",
    icon: "Cpu",
    description: "Deep dive into Kernel Architecture, CPU Scheduling, Process Synchronization, Semaphores, Deadlocks, Memory Management, Virtual Paging, and File Systems.",
    certificateTitle: "Mastery Certification in Operating Systems & Kernel Architecture",
    topicsCovered: ["Kernel & Dual Mode", "Process Management & PCB", "CPU Scheduling Algorithms", "Process Synchronization", "Semaphores & Mutex", "Deadlock Prevention & Banker's", "Paging & Segmentation", "Virtual Memory & Page Replacement"],
    setArchetypes: [
      { title: "OS Architecture & Dual-Mode Execution", focus: "User mode vs Kernel mode, System Calls, Interrupts vs Traps" },
      { title: "Processes & Process Control Block (PCB)", focus: "Process states, PCB structure, Context switching overhead" },
      { title: "Threads & Multithreading Models", focus: "User-level vs Kernel-level threads, Many-to-One, One-to-One, Many-to-Many" },
      { title: "Inter-Process Communication (IPC)", focus: "Shared Memory vs Message Passing, Pipes, Sockets, RPCs" },
      { title: "Non-Preemptive CPU Scheduling", focus: "First-Come First-Served (FCFS), Shortest Job First (SJF), Priority" },
      { title: "Preemptive CPU Scheduling", focus: "Round Robin, Shortest Remaining Time First (SRTF), Multilevel Feedback Queues" },
      { title: "Critical Section Problem & Requirements", focus: "Mutual Exclusion, Progress, Bounded Waiting" },
      { title: "Hardware & Software Synchronization", focus: "Peterson's Algorithm, Test-and-Set, Compare-and-Swap instructions" },
      { title: "Semaphores & Mutex Locks", focus: "Counting vs Binary Semaphores, Wait/Signal operations, Spinlocks" },
      { title: "Classic Synchronization Problems", focus: "Producer-Consumer (Bounded Buffer), Readers-Writers, Dining Philosophers" },
      { title: "Monitors & Condition Variables", focus: "Monitor semantics, Hoare vs Mesa scheduling, Signal-and-Wait" },
      { title: "Deadlock Characterization & RAG", focus: "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait, Resource Allocation Graph" },
      { title: "Deadlock Prevention & Avoidance", focus: "Safe states, Banker's Algorithm with Resource-Request check" },
      { title: "Deadlock Detection & Recovery", focus: "Wait-for graph, Process termination, Resource preemption" },
      { title: "Memory Management & Contiguous Allocation", focus: "Logical vs Physical addresses, MMU, First-Fit, Best-Fit, Worst-Fit" },
      { title: "Internal & External Fragmentation", focus: "Compaction, Paging vs Segmentation rationale" },
      { title: "Paging & Translation Lookaside Buffer (TLB)", focus: "Page tables, Effective Memory Access Time (EMAT), Inverted page tables" },
      { title: "Segmentation Architecture", focus: "Segment table, Base and Limit registers, Segment fault protection" },
      { title: "Virtual Memory & Demand Paging", focus: "Page fault sequence, Pure demand paging, Swap space" },
      { title: "Page Replacement: FIFO, Optimal & LRU", focus: "Belady's Anomaly in FIFO, Optimal replacement, LRU approximation" },
      { title: "Advanced Page Replacement: Clock & Second-Chance", focus: "Reference bit, Dirty/Modified bit, Enhanced second-chance" },
      { title: "Thrashing & Working Set Model", focus: "Page-fault frequency, Working-set strategy, Locality of reference" },
      { title: "File System Architecture & Directory Structures", focus: "Contiguous, Linked, Indexed allocation, Inodes in Unix" },
      { title: "Disk Scheduling Algorithms", focus: "FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK" },
      { title: "I/O Hardware, DMA & RAID Levels", focus: "Polling, Interrupt-driven I/O, Direct Memory Access, RAID 0, 1, 5, 6, 10" }
    ]
  },
  {
    courseId: "cn",
    title: "Computer Networks",
    code: "CS-303",
    category: "Networking & Distributed Systems",
    icon: "Network",
    description: "Comprehensive guide to OSI & TCP/IP Reference Models, Framing, Error Control, Sliding Window Protocols, IPv4/IPv6 Subnetting, Routing (Dijkstra, Bellman-Ford), TCP/UDP, and Security.",
    certificateTitle: "Mastery Certification in Computer Networks & Protocols",
    topicsCovered: ["OSI & TCP/IP Layers", "Data Link Layer & Framing", "Sliding Window Protocols", "IP Addressing & CIDR Subnetting", "Routing Algorithms (OSPF, BGP, RIP)", "TCP vs UDP", "Flow & Congestion Control", "DNS, HTTP, HTTPS, SSL/TLS"],
    setArchetypes: [
      { title: "Network Architecture & Topologies", focus: "Mesh, Star, Bus, Ring, Circuit vs Packet Switching" },
      { title: "OSI vs TCP/IP Reference Models", focus: "7-layer OSI duties, PDU naming (Bits, Frames, Packets, Segments)" },
      { title: "Physical Layer & Transmission Media", focus: "Nyquist & Shannon Capacity Theorems, Guided vs Unguided media" },
      { title: "Framing & Error Detection", focus: "Bit/Byte Stuffing, Parity, Checksum, Cyclic Redundancy Check (CRC)" },
      { title: "Error Correction & Hamming Code", focus: "Hamming distance, Single error correction, 2D Parity" },
      { title: "Flow Control: Stop-and-Wait", focus: "Stop-and-Wait ARQ efficiency formula, Propagation vs Transmission delay" },
      { title: "Sliding Window: Go-Back-N Protocol", focus: "Sender/Receiver window sizes, Cumulative ACKs, Efficiency derivation" },
      { title: "Sliding Window: Selective Repeat Protocol", focus: "Individual ACKs, Sender/Receiver window relationship N <= 2^(k-1)" },
      { title: "Medium Access: ALOHA & Slotted ALOHA", focus: "Pure ALOHA (18.4% max throughput) vs Slotted ALOHA (36.8%)" },
      { title: "Carrier Sense: CSMA, CSMA/CD & CSMA/CA", focus: "1-persistent, Non-persistent, p-persistent, Collision detection formula L >= 2*Tp*B" },
      { title: "Ethernet Standards & MAC Addressing", focus: "IEEE 802.3, 48-bit MAC format, Preamble, SFD, Hubs vs Switches" },
      { title: "Network Layer & IPv4 Header Architecture", focus: "20-byte base header, TTL, Identification, Flags (DF, MF), Fragment Offset" },
      { title: "Classful IP Addressing & Subnetting", focus: "Class A, B, C, D, E address ranges, Subnet masks, Broadcast address" },
      { title: "Classless Addressing (CIDR) & VLSM", focus: "CIDR notation /24, Variable Length Subnet Masking, Address aggregation" },
      { title: "Address Resolution Protocols: ARP & RARP", focus: "ARP request broadcast, ARP reply unicast, Gratuitous ARP, Proxy ARP" },
      { title: "ICMP & Network Diagnostic Utilities", focus: "Ping (Echo Request/Reply), Traceroute TTL expiration, Destination Unreachable" },
      { title: "Intra-Domain Routing: Distance Vector (RIP)", focus: "Bellman-Ford equation, Count-to-Infinity problem, Split Horizon, Poison Reverse" },
      { title: "Intra-Domain Routing: Link State (OSPF)", focus: "Dijkstra algorithm, Link State Advertisements (LSA), Area hierarchy" },
      { title: "Inter-Domain Routing: BGP", focus: "Path Vector protocol, Autonomous Systems (AS), eBGP vs iBGP" },
      { title: "Transport Layer: UDP Architecture", focus: "8-byte UDP header, Connectionless, Unreliable, Use cases in DNS/Streaming" },
      { title: "Transport Layer: TCP Header & 3-Way Handshake", focus: "SYN, SYN-ACK, ACK, FIN handshake, Sequence/ACK numbers" },
      { title: "TCP Congestion Control Algorithms", focus: "Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery (AIMD)" },
      { title: "Application Layer: DNS Architecture", focus: "Hierarchical namespace, Root, TLD, Authoritative servers, Recursive vs Iterative" },
      { title: "Application Layer: HTTP, HTTPS & Web Protocols", focus: "HTTP/1.1 vs HTTP/2 vs HTTP/3, Cookies, REST, SSL/TLS handshake" },
      { title: "Network Security & Cryptographic Protocols", focus: "Symmetric vs Asymmetric Encryption, RSA, Firewalls, IPSec, NAT/PAT" }
    ]
  },
  {
    courseId: "coa",
    title: "Computer Organization & Architecture",
    code: "CS-304",
    category: "Hardware & Computer Systems",
    icon: "Cpu",
    description: "Explore CPU Design, Instruction Cycle, Addressing Modes, RISC vs CISC, Instruction Pipelining, Hazards, Cache Memory Mapping, Virtual Memory, and Interrupts.",
    certificateTitle: "Mastery Certification in Computer Organization & Architecture",
    topicsCovered: ["Instruction Formats", "Addressing Modes", "RISC vs CISC", "Instruction Pipelining", "Pipeline Hazards (Structural, Data, Control)", "Cache Memory (Direct, Associative, Set-Associative)", "Cache Replacement & Write Policies", "Secondary Storage & DMA"],
    setArchetypes: [
      { title: "Data Representation & Binary Arithmetic", focus: "IEEE 754 Floating Point (Single/Double precision), 2's Complement overflow" },
      { title: "Instruction Formats & Opcode Encoding", focus: "Zero, One, Two, Three-address instructions, Expanding opcode technique" },
      { title: "Addressing Modes: Immediate, Direct & Indirect", focus: "Effective address calculation, Memory access cycles" },
      { title: "Addressing Modes: Register, Indexed & Base-Register", focus: "PC-relative addressing, Auto-increment/decrement" },
      { title: "CPU Control Unit: Hardwired vs Microprogrammed", focus: "Horizontal vs Vertical microinstructions, Control word, Nano-programming" },
      { title: "RISC vs CISC Architectures", focus: "Load-Store architecture, Single-cycle execution, Large register file vs Complex instructions" },
      { title: "Instruction Cycle & Micro-operations", focus: "Fetch, Decode, Execute, Interrupt cycle, Register Transfer Language (RTL)" },
      { title: "Instruction Pipelining Principles", focus: "5-stage pipeline (IF, ID, EX, MEM, WB), Speedup formula S = n*k / (k + n - 1)" },
      { title: "Pipeline Hazards: Structural Hazards", focus: "Resource conflict, Memory port bottlenecks, Pipeline bubble insertion" },
      { title: "Pipeline Hazards: Data Hazards (RAW, WAR, WAW)", focus: "Read After Write dependency, Operand forwarding (bypassing), Compiler scheduling" },
      { title: "Pipeline Hazards: Control Hazards & Branch Prediction", focus: "Branch penalty, Static vs Dynamic branch prediction, Branch Target Buffer (BTB)" },
      { title: "Memory Hierarchy & Locality of Reference", focus: "Temporal vs Spatial Locality, Access time, Cost per bit" },
      { title: "Direct Cache Mapping", focus: "Tag, Line/Index, Word/Offset bits, Conflict miss behavior" },
      { title: "Fully Associative Cache Mapping", focus: "Tag and Word bits, Simultaneous parallel comparator search" },
      { title: "K-Way Set Associative Cache Mapping", focus: "Tag, Set Index, Word bits, Calculation of tag array memory overhead" },
      { title: "Cache Miss Classification (3Cs)", focus: "Compulsory (Cold), Capacity, Conflict misses" },
      { title: "Cache Write Policies: Write-Through vs Write-Back", focus: "Dirty bit tracking, Write-Allocate vs No-Write-Allocate on write miss" },
      { title: "Cache Replacement Algorithms (LRU, FIFO, LFU)", focus: "LRU stack implementation, Pseudo-LRU" },
      { title: "Multi-Level Cache Systems (L1, L2, L3)", focus: "Average Memory Access Time (AMAT) = Hit_Time + Miss_Rate * Miss_Penalty" },
      { title: "Main Memory Organization: Interleaving", focus: "High-order vs Low-order interleaving, Memory bandwidth scaling" },
      { title: "Virtual Memory Organization & Paging Hardware", focus: "Page size calculation, Multi-level page table memory overhead" },
      { title: "I/O Interface & Programmed I/O", focus: "Memory-Mapped I/O vs Port-Mapped (Isolated) I/O" },
      { title: "Interrupts & Vector Interrupt Architecture", focus: "Maskable vs Non-maskable interrupts, Daisy Chaining priority resolution" },
      { title: "Direct Memory Access (DMA) Transfer Modes", focus: "Burst mode, Cycle Stealing mode, Transparent mode, DMA Controller" },
      { title: "Parallel Processing & Flynn's Taxonomy", focus: "SISD, SIMD, MISD, MIMD, Vector processors, Multicore cache coherence (MESI)" }
    ]
  },
  {
    courseId: "oops",
    title: "Object-Oriented Programming & Design Patterns",
    code: "CS-305",
    category: "Software Architecture & Languages",
    icon: "Boxes",
    description: "Master OOP Foundations, Classes, Inheritance, Runtime Polymorphism, Abstract Classes, Interfaces, SOLID Principles, and GoF Design Patterns.",
    certificateTitle: "Mastery Certification in Object-Oriented Architecture & Design Patterns",
    topicsCovered: ["Encapsulation & Abstraction", "Inheritance Types", "Virtual Functions & vtable", "Method Overloading vs Overriding", "Interfaces & Abstract Classes", "SOLID Principles", "Creational Patterns (Singleton, Factory, Builder)", "Structural & Behavioral Patterns"],
    setArchetypes: [
      { title: "OOP Core Pillars: Encapsulation & Abstraction", focus: "Access specifiers (public, private, protected), Getters/Setters, Information Hiding" },
      { title: "Constructors, Destructors & Object Lifecycle", focus: "Default, Parameterized, Copy Constructor (Deep vs Shallow Copy), Destructor execution" },
      { title: "Inheritance Types & Diamond Problem", focus: "Single, Multilevel, Multiple, Hierarchical, Virtual Base Class solution" },
      { title: "Compile-Time Polymorphism", focus: "Function Overloading, Operator Overloading rules and limitations" },
      { title: "Runtime Polymorphism & Virtual Functions", focus: "Dynamic dispatch, vptr, vtable internal memory layout" },
      { title: "Pure Virtual Functions & Abstract Classes", focus: "Abstract Class instantiation rules, Pure virtual destructor" },
      { title: "Interfaces & Multiple Interface Implementation", focus: "Interface segregation, Default interface methods in Java" },
      { title: "Static vs Instance Members & Memory Management", focus: "Static variables, Static methods, `this` pointer mechanics" },
      { title: "Exception Handling Architecture", focus: "Try, Catch, Finally, Throw, Custom exception hierarchies, RAII in C++" },
      { title: "Generics & Template Metaprogramming", focus: "Type safety, Template specialization, Type erasure in Java" },
      { title: "SOLID: Single Responsibility Principle (SRP)", focus: "Separation of concerns, Cohesion vs Coupling" },
      { title: "SOLID: Open/Closed Principle (OCP)", focus: "Open for extension, closed for modification using polymorphism" },
      { title: "SOLID: Liskov Substitution Principle (LSP)", focus: "Subtypes must be substitutable for base types without breaking correctness" },
      { title: "SOLID: Interface Segregation Principle (ISP)", focus: "No client should be forced to depend on methods it does not use" },
      { title: "SOLID: Dependency Inversion Principle (DIP)", focus: "High-level modules should depend on abstractions, not concrete implementations" },
      { title: "Singleton Design Pattern", focus: "Thread-safe Singleton, Double-checked locking, Bill Pugh implementation" },
      { title: "Factory Method & Abstract Factory Patterns", focus: "Decoupling object creation from client code" },
      { title: "Builder & Prototype Patterns", focus: "Constructing complex objects step-by-step, Object cloning" },
      { title: "Adapter & Facade Patterns", focus: "Converting incompatible interfaces, Providing unified simplified interface" },
      { title: "Decorator & Proxy Patterns", focus: "Adding dynamic behavior without subclassing, Lazy loading proxy" },
      { title: "Composite & Flyweight Patterns", focus: "Tree structures of objects, Sharing fine-grained immutable instances" },
      { title: "Observer & Strategy Patterns", focus: "Publish-Subscribe events, Swapping interchangeable algorithms at runtime" },
      { title: "Command & State Patterns", focus: "Encapsulating requests as objects (Undo/Redo), State machine encapsulation" },
      { title: "Iterator & Template Method Patterns", focus: "Sequential collection access, Defining algorithm skeleton in superclass" },
      { title: "Clean Code & Refactoring Practices", focus: "Code smells, DRY, YAGNI, Law of Demeter, Dependency Injection frameworks" }
    ]
  },
  {
    courseId: "toc",
    title: "Theory of Computation & Compiler Design",
    code: "CS-306",
    category: "Formal Languages & Compilers",
    icon: "Binary",
    description: "Explore Finite Automata (DFA, NFA), Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines, Lexical Analysis, and Syntax Parsing.",
    certificateTitle: "Mastery Certification in Theory of Computation & Compilers",
    topicsCovered: ["DFA & NFA Construction", "Minimization of DFA", "Regular Expressions & Pumping Lemma", "Context-Free Grammars (CFG)", "Pushdown Automata (PDA)", "Turing Machines & Decidability", "Lexical Analysis & Flex", "Parsing (LL(1), LR(0), SLR, CLR, LALR)"],
    setArchetypes: [
      { title: "Alphabet, Strings & Languages", focus: "Kleene Star vs Kleene Plus, Language cardinality, Prefix/Suffix/Substrings" },
      { title: "Deterministic Finite Automata (DFA)", focus: "5-tuple definition, Transition table, State diagram, Acceptance condition" },
      { title: "Non-Deterministic Finite Automata (NFA)", focus: "Epsilon-NFA, Subset Construction (NFA to DFA conversion)" },
      { title: "Minimization of DFA (Myhill-Nerode & Table Filling)", focus: "Equivalent states, Quotient construction algorithm" },
      { title: "Regular Expressions & Arden's Theorem", focus: "R = Q + RP solution R = QP*, Converting DFA to Regex" },
      { title: "Pumping Lemma for Regular Languages", focus: "Proving non-regularity (e.g. L = {a^n b^n | n >= 0})" },
      { title: "Closure Properties of Regular Languages", focus: "Union, Intersection, Complement, Concatenation, Reversal, Homomorphism" },
      { title: "Context-Free Grammars (CFG) & Derivations", focus: "Leftmost vs Rightmost derivations, Parse trees, Ambiguity in grammars" },
      { title: "Chomsky Hierarchy of Languages", focus: "Type 0 (Unrestricted), Type 1 (CSG), Type 2 (CFG), Type 3 (Regular)" },
      { title: "Simplification of CFG & Normal Forms", focus: "Eliminating Null/Unit productions, Chomsky Normal Form (CNF), GNF" },
      { title: "Pushdown Automata (PDA)", focus: "Stack operations (Push, Pop, No-op), Deterministic vs Non-Deterministic PDA" },
      { title: "Pumping Lemma for Context-Free Languages", focus: "Pumping condition s = uvxyz, Proving non-CFL languages" },
      { title: "Turing Machine Architecture", focus: "7-tuple definition, Infinite tape, Read/Write head, Halting state" },
      { title: "Decidability, Halting Problem & Reducibility", focus: "Recursive vs Recursively Enumerable languages, Rice's Theorem, Post Correspondence Problem" },
      { title: "Compiler Structure & Phases", focus: "Analysis vs Synthesis, Lexical, Syntax, Semantic, Intermediate Code, Optimizer, Code Gen" },
      { title: "Lexical Analysis & Token Generation", focus: "Tokens, Patterns, Lexemes, Regular definitions, Lex/Flex tools" },
      { title: "Eliminating Left Recursion & Left Factoring", focus: "Immediate and indirect left recursion removal for top-down parsing" },
      { title: "FIRST and FOLLOW Sets Construction", focus: "Mathematical rules for computing FIRST and FOLLOW sets" },
      { title: "Top-Down Parsing: LL(1) Parsers", focus: "LL(1) parsing table construction, Conflict detection (ambiguity checks)" },
      { title: "Bottom-Up Parsing: Shift-Reduce & LR(0)", focus: "Handle pruning, LR(0) item sets, Canonical collection DFA" },
      { title: "SLR(1) Parsing Table Construction", focus: "Using FOLLOW sets to resolve Shift-Reduce and Reduce-Reduce conflicts" },
      { title: "Canonical LR (CLR / LR(1)) Parsers", focus: "LR(1) items with lookaheads [A -> alpha . beta, a], Increased table states" },
      { title: "LALR(1) Parsing (Yacc / Bison)", focus: "Merging states with identical cores, Conflict resolution in LALR" },
      { title: "Syntax-Directed Translation (SDT) & Attributes", focus: "Synthesized vs Inherited attributes, S-attributed vs L-attributed definitions" },
      { title: "Intermediate Code & Code Optimization", focus: "Three-Address Code (TAC), Quadruples, Triples, Basic Blocks, Loop Invariant code motion" }
    ]
  },
  {
    courseId: "se",
    title: "Software Engineering & System Design",
    code: "CS-307",
    category: "Software Engineering & Distributed Systems",
    icon: "LayoutDashboard",
    description: "Master SDLC Models, Agile/Scrum, Requirements Engineering, Microservices Architecture, High-Level System Design, Scalability, Caching, and API Design.",
    certificateTitle: "Mastery Certification in Software Engineering & High-Level System Design",
    topicsCovered: ["SDLC Models (Waterfall, Spiral, Agile)", "Scrum Ceremonies", "UML & Class Diagrams", "Software Testing (Unit, Integration, Black/White box)", "Microservices vs Monolith", "Load Balancing & Caching (Redis, CDN)", "Database Sharding & Replication", "RESTful & GraphQL API Design"],
    setArchetypes: [
      { title: "Software Development Life Cycle (SDLC)", focus: "Requirements, Design, Implementation, Testing, Deployment, Maintenance" },
      { title: "Traditional Process Models: Waterfall & V-Model", focus: "Sequential phases, Verification and Validation mapping" },
      { title: "Evolutionary Models: Prototype & Spiral Model", focus: "Risk analysis, Iterative refinement, Spiral quadrants" },
      { title: "Agile Methodology & Scrum Framework", focus: "Agile Manifesto, Sprints, Product Backlog, Daily Standup, Retrospectives" },
      { title: "Requirements Engineering & SRS Specifications", focus: "Functional vs Non-Functional Requirements, IEEE 830 SRS standard" },
      { title: "Software Cost Estimation: COCOMO Model", focus: "Basic, Intermediate, Detailed COCOMO, Organic, Semidetached, Embedded modes" },
      { title: "Software Architecture: Cohesion & Coupling", focus: "High cohesion, Low coupling, Levels of coupling (Content to Data)" },
      { title: "Object-Oriented Analysis & UML Modeling", focus: "Use Case diagrams, Class diagrams, Sequence diagrams, State machine diagrams" },
      { title: "Software Testing Fundamentals: White-Box Testing", focus: "Cyclomatic Complexity V(G) = E - N + 2P, Basis Path Testing, Statement/Branch coverage" },
      { title: "Black-Box Testing Techniques", focus: "Equivalence Class Partitioning, Boundary Value Analysis, Cause-Effect graphing" },
      { title: "Levels of Testing & CI/CD Pipelines", focus: "Unit, Integration (Top-Down, Bottom-Up), System, Acceptance (Alpha/Beta), CI/CD Automation" },
      { title: "Software Maintenance & Reverse Engineering", focus: "Corrective, Adaptive, Perfective, Preventive maintenance, Re-engineering" },
      { title: "System Design Foundations: Vertical vs Horizontal Scaling", focus: "Scale-up vs Scale-out tradeoffs, Stateless architecture" },
      { title: "Load Balancers & Reverse Proxies", focus: "Round Robin, Weighted, Least Connections, Consistent Hashing, Nginx vs HAProxy" },
      { title: "Caching Strategies & Cache Invalidation", focus: "Write-Through, Write-Back, Write-Around, Cache-Aside, Redis, Memcached, CDNs" },
      { title: "Database Scaling: Replication & Partitioning", focus: "Primary-Replica replication, Read replicas, Vertical sharding, Horizontal sharding" },
      { title: "Distributed Data: Consistent Hashing", focus: "Hash ring, Virtual nodes, Minimizing rehashing overhead on server addition/removal" },
      { title: "CAP Theorem & PACELC Theorem", focus: "Consistency, Availability, Partition tolerance tradeoffs in distributed systems" },
      { title: "Message Brokers & Event-Driven Architecture", focus: "Pub/Sub vs Queue, Apache Kafka, RabbitMQ, At-least-once vs Exactly-once delivery" },
      { title: "Microservices Architecture & Service Mesh", focus: "Domain-Driven Design (DDD), API Gateway pattern, Circuit Breaker, Istio" },
      { title: "API Design: REST vs GraphQL vs gRPC", focus: "HTTP verbs, Status codes, Schema-first design, Protocol Buffers" },
      { title: "Rate Limiting & Throttling Algorithms", focus: "Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log" },
      { title: "Distributed Consensus: Raft & Paxos", focus: "Leader election, Log replication, Split-brain resolution" },
      { title: "System Design Case Study: URL Shortener (TinyURL)", focus: "Base62 encoding, Hash collision resolution, DB schema, 100M daily read scaling" },
      { title: "System Design Case Study: Real-Time Chat System", focus: "WebSockets, Long Polling, Presence servers, Message synchronization" }
    ]
  }
];

const { generateSpecificQuestionsForSet } = require("./coreQuestionsGenerator");

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestionsForSet(courseId, setIndex, setArchetype) {
  const generated = generateSpecificQuestionsForSet(courseId, setIndex, setArchetype);
  return generated.map(item => ({
    question: item.question,
    type: item.type || "mcq",
    codeSnippet: item.codeSnippet || "",
    options: shuffleArray(item.options),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation
  }));
}

// Generate the complete 25 sets for a course
function generateCourseSets(course) {
  const sets = [];
  for (let i = 0; i < 25; i++) {
    const archetype = course.setArchetypes[i] || { title: `${course.title} Advanced Set ${i + 1}`, focus: `Core topic ${i + 1}` };
    const questions = generateQuestionsForSet(course.courseId, i, archetype);

    sets.push({
      setNumber: i + 1,
      title: archetype.title,
      description: `Comprehensive mastery of ${archetype.title}. Focus areas: ${archetype.focus}.`,
      conceptGuide: {
        overview: `${archetype.title} is a core foundation of ${course.title}. Understanding ${archetype.focus} is critical for system architecture and competitive exams (GATE, FAANG).`,
        keyFormulasOrRules: [
          `Key Invariant: Enforce deterministic correctness in ${archetype.focus}.`,
          "Time/Space Complexity Target: O(1) or O(log N) optimal design.",
          "Critical Boundary: Check edge cases including empty/null states and maximum limits."
        ],
        codeOrQueryExample: `// ${archetype.title} Core Pattern\nfunction processUnit(input) {\n    // Validated state transition for ${archetype.title}\n    return optimalResult;\n}`,
        interviewTips: `Common FAANG interview question: Explain tradeoffs between time complexity, memory overhead, and implementation simplicity in ${archetype.title}.`
      },
      questions,
      xpReward: 50
    });
  }
  return sets;
}

// Main Seeder Function for CSE Core Subjects
async function seedCoreSubjects() {
  try {
    console.log("[CSE Core Subjects Seeder] Seeding 7 CSE Core Subject Courses with 25 Unique Topic-Specific Sets each...");
    await CoreSubjectCourse.deleteMany({});

    const coursesToInsert = CSE_COURSES.map(c => ({
      courseId: c.courseId,
      title: c.title,
      code: c.code,
      category: c.category,
      icon: c.icon,
      description: c.description,
      certificateTitle: c.certificateTitle,
      topicsCovered: c.topicsCovered,
      sets: generateCourseSets(c),
      totalSets: 25,
      totalQuestions: 125
    }));

    await CoreSubjectCourse.insertMany(coursesToInsert);
    console.log(`[CSE Core Subjects Seeder] Successfully seeded all 7 CSE Core Courses with 175 unique sets and 875+ custom MCQs!`);
  } catch (err) {
    console.error("[CSE Core Subjects Seeder Error]:", err);
  }
}

module.exports = {
  seedCoreSubjects,
  CSE_COURSES
};
