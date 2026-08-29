const fs = require("fs");

const subjects = [
  "DSA",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Java",
  "Python",
  "Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Software Engineering"
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const questionsPool = [
  {
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)"
  },
  {
    question: "Which scheduling algorithm avoids starvation?",
    options: ["FCFS", "Round Robin", "Priority Scheduling", "None"],
    answer: "Round Robin"
  },
  {
    question: "Which SQL command is used to retrieve data?",
    options: ["SELECT", "INSERT", "DELETE", "UPDATE"],
    answer: "SELECT"
  },
  {
    question: "Which protocol is used to transfer web pages?",
    options: ["HTTP", "FTP", "SMTP", "TCP"],
    answer: "HTTP"
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    options: ["extends", "implements", "inherits", "super"],
    answer: "extends"
  },
  {
    question: "Which Python data structure is immutable?",
    options: ["List", "Set", "Tuple", "Dictionary"],
    answer: "Tuple"
  },
  {
    question: "Which algorithm is used for shortest path?",
    options: ["Dijkstra", "DFS", "BFS", "Kruskal"],
    answer: "Dijkstra"
  },
  {
    question: "Which layer handles routing in OSI model?",
    options: ["Network", "Transport", "Application", "Session"],
    answer: "Network"
  },
  {
    question: "Which HTML tag is used for links?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: "<a>"
  }
];

let questions = [];

for (let i = 0; i < 5000; i++) {
  const q = questionsPool[Math.floor(Math.random() * questionsPool.length)];

  questions.push({
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    level: levels[Math.floor(Math.random() * levels.length)],
    question: q.question,
    options: q.options,
    answer: q.answer
  });
}

fs.writeFileSync("questions.json", JSON.stringify(questions, null, 2));

console.log("✅ 5000 questions generated successfully!");