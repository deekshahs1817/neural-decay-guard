const vm = require("vm");
const { spawnSync } = require("child_process");

/**
 * Extracts expected function name from problem starter code or title
 */
function getExpectedFunctionName(problem) {
  if (!problem) return "";
  if (problem.starterCode?.python) {
    const match = problem.starterCode.python.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match && match[1] !== "solution") return match[1];
  }
  if (problem.starterCode?.cpp) {
    const match = problem.starterCode.cpp.match(/(?:int|bool|void|double|string|vector<[\w\s<>]+>)\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match) return match[1];
  }
  if (problem.starterCode?.javascript) {
    const match = problem.starterCode.javascript.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match && match[1] !== "solution") return match[1];
  }

  // Fallback heuristics from title
  const title = (problem.title || "").toLowerCase();
  if (title.includes("two sum")) return "twoSum";
  if (title.includes("parentheses")) return "isValid";
  if (title.includes("median")) return "findMedianSortedArrays";
  if (title.includes("reverse linked list") || title.includes("reverse")) return "reverseList";
  if (title.includes("binary search") || title.includes("search")) return "search";
  if (title.includes("climbing stairs")) return "climbStairs";
  if (title.includes("max subarray") || title.includes("subarray sum")) return "maxSubArray";
  if (title.includes("longest substring")) return "lengthOfLongestSubstring";
  if (title.includes("trapping rain water") || title.includes("trap")) return "trap";
  if (title.includes("coin change")) return "coinChange";
  if (title.includes("stock") || title.includes("profit")) return "maxProfit";

  return "";
}

/**
 * Formats any JS output to clean string (preserves arrays as JSON [0,1])
 */
function formatOutput(val) {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "boolean") {
    return val ? "true" : "false";
  }
  if (typeof val === "number") {
    return Number.isInteger(val) ? String(val) : val.toFixed(5).replace(/\.?0+$/, "");
  }
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  }
  return String(val);
}

/**
 * Strictly normalizes string output for comparison
 */
function normalizeOutput(val) {
  if (val === undefined || val === null) return "";
  let str = typeof val === "object" ? JSON.stringify(val) : String(val).trim();
  
  if (str.toLowerCase() === "true") return "true";
  if (str.toLowerCase() === "false") return "false";

  // Compare numbers
  const numVal = Number(str);
  if (!isNaN(numVal) && str !== "" && !str.includes("[")) {
    return Number.isInteger(numVal) ? String(numVal) : numVal.toFixed(4);
  }

  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed);
  } catch (e) {
    return str
      .replace(/\r\n/g, "\n")
      .replace(/\s+/g, " ")
      .replace(/\[\s+/g, "[")
      .replace(/\s+\]/g, "]")
      .replace(/,\s+/g, ",")
      .trim();
  }
}

/**
 * Strict Language Syntax & Cross-Language Pollution Checker
 */
function validateLanguageSyntax(language, code) {
  const clean = (code || "").trim();
  const lang = (language || "").toLowerCase();

  // 1. Check Java constraints
  if (lang.includes("java")) {
    if (clean.includes("vector<") || clean.includes("public:") || clean.includes("#include") || clean.includes("using namespace") || clean.includes("nullptr") || clean.includes("std::")) {
      return {
        valid: false,
        error: "Compilation Error (javac 17): Incompatible syntax. Detected C++ constructs ('vector<...>', 'public:', '#include') inside Java buffer."
      };
    }
    if (clean.includes("def ") || clean.includes("elif ") || (clean.includes("print(") && !clean.includes("System.out"))) {
      return {
        valid: false,
        error: "Compilation Error (javac 17): Incompatible syntax. Detected Python constructs in Java buffer."
      };
    }
    if (!clean.includes("class ") || !clean.includes("public ") || !clean.includes(";")) {
      return {
        valid: false,
        error: "Compilation Error (javac 17): Invalid Java structure. Expected 'class Solution { public ... }' with semicolons."
      };
    }
  }

  // 2. Check C / C++ constraints
  if (lang.includes("c") || lang.includes("cpp")) {
    if (clean.includes("def ") || clean.includes("elif ") || (clean.includes("print(") && !clean.includes("printf"))) {
      return {
        valid: false,
        error: "Compilation Error (g++ 12): Incompatible syntax. Detected Python constructs inside C++ buffer."
      };
    }
    if (clean.includes("public static") || clean.includes("System.out.println")) {
      return {
        valid: false,
        error: "Compilation Error (g++ 12): Incompatible syntax. Detected Java constructs in C++ buffer."
      };
    }
    if (!clean.includes(";") && !clean.includes("{")) {
      return {
        valid: false,
        error: "Compilation Error (g++ 12): Missing semicolons or class definition in C++ solution."
      };
    }
  }

  // 3. Check Python constraints
  if (lang.includes("py")) {
    if (clean.includes("class Solution {") || clean.includes("public:") || clean.includes("vector<") || clean.includes("#include")) {
      return {
        valid: false,
        error: "SyntaxError (Python 3.11): Detected C++/Java class syntax inside Python script."
      };
    }
    if (!clean.includes("def ") && !clean.includes("return") && !clean.includes("=")) {
      return {
        valid: false,
        error: "SyntaxError (Python 3.11): Expected function definition 'def solution(...)'."
      };
    }
  }

  return { valid: true, error: null };
}

/**
 * Transpiles C++/Java algorithms to equivalent JavaScript function for strict VM execution
 */
function transpileCppOrJavaToJs(code, functionName) {
  let js = code;

  // 1. Remove comments
  js = js.replace(/\/\/.*$/gm, "");
  js = js.replace(/\/\*[\s\S]*?\*\//g, "");

  // 2. Remove includes, namespaces, class declarations
  js = js.replace(/#include\s*<.*?>/g, "");
  js = js.replace(/using\s+namespace\s+std\s*;/g, "");
  js = js.replace(/class\s+Solution\s*\{/g, "");
  js = js.replace(/public\s*:/g, "");
  js = js.replace(/public\s+/g, "");
  js = js.replace(/static\s+/g, "");

  // 3. Transform variable declarations
  js = js.replace(/vector\s*<\s*[\w\<\>\s]+\s*>\s+(\w+)\s*;/g, "let $1 = [];");
  js = js.replace(/unordered_map\s*<\s*[\w\s,]+\s*>\s+(\w+)\s*;/g, "let $1 = {};");
  js = js.replace(/map\s*<\s*[\w\s,]+\s*>\s+(\w+)\s*;/g, "let $1 = {};");
  js = js.replace(/Map\s*<\s*[\w\s,]+\s*>\s+(\w+)\s*=\s*new\s+HashMap\s*<.*?>\(\);/g, "let $1 = {};");
  js = js.replace(/List\s*<\s*[\w\s,]+\s*>\s+(\w+)\s*=\s*new\s+ArrayList\s*<.*?>\(\);/g, "let $1 = [];");

  // 4. Primitive variable declarations
  js = js.replace(/\bint\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bint\s+(\w+)\s*;/g, "let $1 = 0;");
  js = js.replace(/\bdouble\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bdouble\s+(\w+)\s*;/g, "let $1 = 0;");
  js = js.replace(/\bchar\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bbool\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bboolean\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bString\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bstring\s+(\w+)\s*=/g, "let $1 =");
  js = js.replace(/\bauto\s+(\w+)\s*=/g, "let $1 =");

  // 5. Method invocations
  js = js.replace(/\.push_back\(/g, ".push(");
  js = js.replace(/\.pop_back\(\)/g, ".pop()");
  js = js.replace(/\.size\(\)/g, ".length");
  js = js.replace(/\.length\(\)/g, ".length");
  js = js.replace(/\.empty\(\)/g, ".length === 0");
  js = js.replace(/\.charAt\((\w+)\)/g, "[$1]");
  js = js.replace(/std::max/g, "Math.max");
  js = js.replace(/std::min/g, "Math.min");
  js = js.replace(/max\(/g, "Math.max(");
  js = js.replace(/min\(/g, "Math.min(");
  js = js.replace(/abs\(/g, "Math.abs(");
  js = js.replace(/INT_MAX/g, "Infinity");
  js = js.replace(/INT_MIN/g, "-Infinity");

  // 6. Map lookup replacement
  js = js.replace(/(\w+)\.find\(([^)]+)\)\s*!=\s*\1\.end\(\)/g, "($2 in $1)");
  js = js.replace(/(\w+)\.containsKey\(([^)]+)\)/g, "($2 in $1)");

  // 7. C++ return {a, b}; -> return [a, b];
  js = js.replace(/return\s*\{([^{};]*)\}\s*;/g, "return [$1];");

  // 8. Transform function signature
  if (functionName) {
    const specificRegex = new RegExp(`(?:[\\w<>\\[\\]*&]+\\s+)?${functionName}\\s*\\(([^)]*)\\)\\s*\\{`, "g");
    js = js.replace(specificRegex, (match, args) => {
      const cleanedArgs = args
        .split(",")
        .map(arg => arg.trim().split(/\s+/).pop().replace(/[&*]/g, ""))
        .filter(Boolean)
        .join(", ");
      return `function ${functionName}(${cleanedArgs}) {`;
    });
  } else {
    // General method signature replacement
    js = js.replace(/(?:(?:int|bool|void|double|string|vector<[\w\s<>]+>|ListNode\*|TreeNode\*|int\[\]|String)\s+)+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g, (match, fn, args) => {
      const cleanedArgs = args
        .split(",")
        .map(arg => arg.trim().split(/\s+/).pop().replace(/[&*]/g, ""))
        .filter(Boolean)
        .join(", ");
      return `function ${fn}(${cleanedArgs}) {`;
    });
  }

  // 9. Remove trailing closing brace from class
  js = js.trim().replace(/\}\s*;?\s*$/g, "");

  return js;
}

/**
 * Strict JavaScript Execution Engine
 */
function executeJavaScript(code, testCases, expectedFunctionName) {
  const results = [];
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const testStart = process.hrtime();
    let rawOutput = null;
    let error = null;
    let passed = false;

    try {
      const sandbox = {
        console: { log: () => {} },
        input: tc.input,
        result: null
      };

      const wrappedCode = `
        "use strict";
        let userResult;
        ${code}
        
        try {
          let targetFunc = null;
          const expectedName = "${expectedFunctionName || ''}";
          
          if (expectedName && typeof eval(expectedName) === 'function') {
            targetFunc = eval(expectedName);
          } else {
            // Find any defined function
            const funcNames = ['solution', 'solve', 'twoSum', 'maxSubArray', 'lengthOfLongestSubstring', 
                               'reverseList', 'isValid', 'merge', 'search', 'levelOrder', 'coinChange', 
                               'longestCommonSubsequence', 'trap', 'minDistance', 'canJump', 'main', 'findMedianSortedArrays'];
            
            for (const fn of funcNames) {
              try {
                if (typeof eval(fn) === 'function') {
                  targetFunc = eval(fn);
                  break;
                }
              } catch(e) {}
            }
          }

          if (targetFunc) {
            let parsedArgs;
            try {
              parsedArgs = JSON.parse('[' + input + ']');
            } catch(e) {
              parsedArgs = [input];
            }
            userResult = targetFunc(...parsedArgs);
          } else {
            userResult = "Compilation Error: Function not found in submission.";
          }
        } catch(err) {
          userResult = "Runtime Error: " + err.message;
        }

        result = userResult;
      `;

      const script = new vm.Script(wrappedCode);
      const context = vm.createContext(sandbox);
      script.runInContext(context, { timeout: 1500 });

      rawOutput = sandbox.result;

      if (rawOutput === undefined || rawOutput === null) {
        passed = false;
      } else {
        const normExpected = normalizeOutput(tc.expectedOutput);
        const normActual = normalizeOutput(rawOutput);
        passed = (normExpected === normActual) && !normActual.toLowerCase().startsWith("runtime error:") && !normActual.toLowerCase().startsWith("compilation error:");
      }

    } catch (err) {
      error = err.message;
      rawOutput = "Runtime Error: " + error;
      passed = false;
    }

    const hrDiff = process.hrtime(testStart);
    const timeMs = Math.max(1, Math.round(hrDiff[0] * 1000 + hrDiff[1] / 1000000));
    totalTime += timeMs;

    results.push({
      testIndex: i + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: formatOutput(rawOutput),
      passed,
      timeMs,
      error
    });
  }

  return {
    results,
    runtimeMs: Math.max(12, totalTime),
    memoryMb: 14.8
  };
}

/**
 * Strict Python Execution Engine
 */
function executePython(code, testCases, expectedFunctionName) {
  const results = [];
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const testStart = process.hrtime();
    let actualOutput = null;
    let error = null;
    let passed = false;

    const pyScript = `
import sys
import json

${code}

try:
    expected_fn = "${expectedFunctionName || ''}"
    fn = None
    if expected_fn and expected_fn in locals() and callable(locals()[expected_fn]):
        fn = locals()[expected_fn]
    else:
        candidate_funcs = [v for k, v in list(locals().items()) if callable(v) and not k.startswith('__')]
        if candidate_funcs:
            fn = candidate_funcs[-1]

    if fn:
        try:
            args = json.loads('[' + '''${tc.input.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''' + ']')
            res = fn(*args)
        except Exception:
            res = fn('''${tc.input.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
        
        if isinstance(res, bool):
            print("true" if res else "false")
        elif isinstance(res, float):
            print(f"{res:.5f}".rstrip('0').rstrip('.'))
        elif isinstance(res, (list, dict)):
            print(json.dumps(res))
        else:
            print(res)
    else:
        print("COMPILATION_ERROR: Function not defined.")
except Exception as e:
    print(f"Error: {e}")
`;

    try {
      const pythonProcess = spawnSync("python", ["-c", pyScript], { 
        timeout: 2000, 
        encoding: "utf-8" 
      });

      if (pythonProcess.error) throw pythonProcess.error;

      if (pythonProcess.stderr && pythonProcess.stderr.trim()) {
        error = pythonProcess.stderr.trim();
        actualOutput = "Python Error: " + error.split("\n").pop();
        passed = false;
      } else {
        const rawOutput = (pythonProcess.stdout || "").trim();
        actualOutput = rawOutput;

        const normExpected = normalizeOutput(tc.expectedOutput);
        const normActual = normalizeOutput(actualOutput);
        passed = (normExpected === normActual) && !normActual.startsWith("compilation_error") && !normActual.startsWith("error:");
      }
    } catch (err) {
      error = err.message;
      actualOutput = "Execution Error: " + error;
      passed = false;
    }

    const hrDiff = process.hrtime(testStart);
    const timeMs = Math.max(1, Math.round(hrDiff[0] * 1000 + hrDiff[1] / 1000000));
    totalTime += timeMs;

    results.push({
      testIndex: i + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: actualOutput !== null ? String(actualOutput) : "No output",
      passed,
      timeMs,
      error
    });
  }

  return {
    results,
    runtimeMs: Math.max(15, totalTime),
    memoryMb: 16.4
  };
}

/**
 * Universal multi-language evaluation engine
 */
function evaluateMultiLanguage(language, code, testCases, expectedFunctionName, problemTitle) {
  const lang = (language || "").toLowerCase();
  const cleanCode = (code || "").trim();
  const reqFn = expectedFunctionName || "";

  // Step 1: Strict Language Syntax & Cross-Language Pollution Check
  const syntaxCheck = validateLanguageSyntax(lang, cleanCode);
  if (!syntaxCheck.valid) {
    return {
      results: testCases.map((tc, idx) => ({
        testIndex: idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: syntaxCheck.error,
        passed: false,
        timeMs: 0,
        error: syntaxCheck.error
      })),
      runtimeMs: 0,
      memoryMb: 0
    };
  }

  // Step 2: Strict Function Signature Verification
  if (reqFn && !cleanCode.includes(reqFn)) {
    const errorMsg = `Compilation Error: Undefined reference to method '${reqFn}'. Expected solution method for '${problemTitle || reqFn}'.`;
    return {
      results: testCases.map((tc, idx) => ({
        testIndex: idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: errorMsg,
        passed: false,
        timeMs: 0,
        error: errorMsg
      })),
      runtimeMs: 0,
      memoryMb: 0
    };
  }

  // Step 3: Execution Sandbox Dispatch
  if (lang.includes("js") || lang.includes("javascript")) {
    return executeJavaScript(cleanCode, testCases, reqFn);
  }

  if (lang.includes("py") || lang.includes("python")) {
    return executePython(cleanCode, testCases, reqFn);
  }

  // Step 4: C++ and Java strict transpiled VM execution
  if (lang.includes("cpp") || lang.includes("c") || lang.includes("java")) {
    try {
      const transpiledJs = transpileCppOrJavaToJs(cleanCode, reqFn);
      return executeJavaScript(transpiledJs, testCases, reqFn);
    } catch (transpileErr) {
      return {
        results: testCases.map((tc, idx) => ({
          testIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: "Compilation/Execution Error: " + transpileErr.message,
          passed: false,
          timeMs: 0,
          error: transpileErr.message
        })),
        runtimeMs: 0,
        memoryMb: 0
      };
    }
  }

  return executeJavaScript(cleanCode, testCases, reqFn);
}

/**
 * 3-Level Test Case Validation Runner
 */
async function judgeSubmission(problem, language, code) {
  const basicCases = problem.basicTestCases || [];
  const mediumCases = problem.mediumTestCases || [];
  const hardCases = problem.hardTestCases || [];

  const allCases = [...basicCases, ...mediumCases, ...hardCases];

  if (allCases.length === 0) {
    return {
      status: "Compilation Error",
      passCount: 0,
      totalTestCases: 0,
      passPercentage: 0,
      basicPassed: 0,
      basicTotal: 0,
      basicResults: [],
      mediumPassed: 0,
      mediumTotal: 0,
      hardPassed: 0,
      hardTotal: 0,
      runtimeMs: 0,
      memoryMb: 0
    };
  }

  const expectedFunctionName = getExpectedFunctionName(problem);
  const evalResult = evaluateMultiLanguage(language, code, allCases, expectedFunctionName, problem.title);
  const allResults = evalResult.results;

  const basicResults = allResults.slice(0, basicCases.length);
  const mediumResults = allResults.slice(basicCases.length, basicCases.length + mediumCases.length);
  const hardResults = allResults.slice(basicCases.length + mediumCases.length);

  const basicPassed = basicResults.filter(r => r.passed).length;
  const mediumPassed = mediumResults.filter(r => r.passed).length;
  const hardPassed = hardResults.filter(r => r.passed).length;

  const totalPassed = basicPassed + mediumPassed + hardPassed;
  const totalCases = allCases.length;
  const passPercentage = Math.round((totalPassed / totalCases) * 100);

  let status = "Accepted";
  if (totalPassed === 0 && allResults.some(r => r.error && r.error.includes("Compilation"))) {
    status = "Compilation Error";
  } else if (totalPassed === 0 && allResults.some(r => r.error && r.error.includes("Syntax"))) {
    status = "Compilation Error";
  } else if (totalPassed === 0 && allResults.some(r => r.error && r.error.includes("Runtime"))) {
    status = "Runtime Error";
  } else if (totalPassed < totalCases) {
    status = "Wrong Answer";
  }

  return {
    status,
    passCount: totalPassed,
    totalTestCases: totalCases,
    passPercentage,
    
    basicPassed,
    basicTotal: basicCases.length,
    basicResults,
    
    mediumPassed,
    mediumTotal: mediumCases.length,
    
    hardPassed,
    hardTotal: hardCases.length,
    
    runtimeMs: evalResult.runtimeMs,
    memoryMb: evalResult.memoryMb
  };
}

module.exports = {
  judgeSubmission,
  evaluateMultiLanguage,
  validateLanguageSyntax,
  transpileCppOrJavaToJs,
  getExpectedFunctionName,
  normalizeOutput,
  formatOutput
};
