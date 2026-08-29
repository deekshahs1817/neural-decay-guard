const { CANONICAL_PROBLEMS } = require("./canonicalProblems");
const { evaluateMultiLanguage, getExpectedFunctionName, normalizeOutput } = require("./judgeEngine");
const CodingProblem = require("../models/CodingProblem");
const crypto = require("crypto");

/**
 * Runs differential accuracy verification across problem test suites
 */
async function auditProblemHealth(problem) {
  const allCases = [
    ...(problem.basicTestCases || []),
    ...(problem.mediumTestCases || []),
    ...(problem.hardTestCases || [])
  ];

  const expectedFn = getExpectedFunctionName(problem);
  const title = problem.title;

  // 1. Check test count
  const hasMinimumTests = allCases.length >= 15;

  // 2. Compute test suite hash to detect duplicates
  const suiteSignature = crypto
    .createHash("sha256")
    .update(allCases.map(c => `${c.input}==>${c.expectedOutput}`).join("|"))
    .digest("hex");

  // 3. Positive Baseline Test: Run Reference / Verified JS Code
  let refCode = "";
  const matchingCanonical = CANONICAL_PROBLEMS.find(p => p.title.toLowerCase() === title.toLowerCase() || p.slug === problem.slug);
  
  if (matchingCanonical && matchingCanonical.referenceSolution) {
    refCode = `function ${expectedFn}(...args) {\n  const fn = ${matchingCanonical.referenceSolution.toString()};\n  return fn(...args);\n}`;
  } else if (problem.starterCode?.javascript) {
    refCode = problem.starterCode.javascript;
  }

  let positivePassRate = 0;
  let positiveVerdict = "Untested";
  let positiveResults = [];

  if (refCode && matchingCanonical?.referenceSolution) {
    const evalRes = evaluateMultiLanguage("javascript", refCode, allCases, expectedFn, title);
    const passedCount = evalRes.results.filter(r => r.passed).length;
    positivePassRate = Math.round((passedCount / allCases.length) * 100);
    positiveVerdict = passedCount === allCases.length ? "Passed (100% Accepted)" : `Failed (${passedCount}/${allCases.length})`;
    positiveResults = evalRes.results;
  }

  // 4. Negative Baseline Test: Intentionally wrong stub
  const wrongCode = `function ${expectedFn}(...args) { return "__WRONG_OUTPUT_TEST_VALUE_NULL__"; }`;
  const negRes = evaluateMultiLanguage("javascript", wrongCode, allCases, expectedFn, title);
  const negPassedCount = negRes.results.filter(r => r.passed).length;
  const negativeCheckPassed = negPassedCount === 0;

  // 5. Cross-signature / Foreign code rejection check
  const foreignCode = `class Solution { public: int foreignMethod(vector<int>& v) { return 0; } };`;
  const foreignRes = evaluateMultiLanguage("cpp", foreignCode, allCases, expectedFn, title);
  const foreignRejected = foreignRes.results.every(r => !r.passed);

  const isHealthy = hasMinimumTests && (positivePassRate === 100 || !matchingCanonical) && negativeCheckPassed && foreignRejected;

  return {
    problemId: problem._id,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    category: problem.category,
    testCaseCount: allCases.length,
    hasMinimumTests,
    suiteSignature,
    positiveVerdict,
    positivePassRate,
    negativeCheckPassed,
    foreignRejected,
    isHealthy,
    sampleTests: allCases.slice(0, 3).map(tc => ({
      input: tc.input,
      expected: tc.expectedOutput
    }))
  };
}

/**
 * Audits all coding problems in the database for accuracy, duplicates, and health
 */
async function auditEntireJudgeSystem() {
  const problems = await CodingProblem.find({}).lean();
  const results = [];
  const signatureMap = new Map();
  const duplicateProblems = [];

  let healthyCount = 0;
  let totalTests = 0;

  for (const prob of problems) {
    const report = await auditProblemHealth(prob);
    results.push(report);

    totalTests += report.testCaseCount;
    if (report.isHealthy) healthyCount++;

    // Duplicate detection
    if (signatureMap.has(report.suiteSignature)) {
      duplicateProblems.push({
        problemA: signatureMap.get(report.suiteSignature),
        problemB: report.title,
        signature: report.suiteSignature
      });
    } else {
      signatureMap.set(report.suiteSignature, report.title);
    }
  }

  const healthScore = problems.length > 0 ? Math.round((healthyCount / problems.length) * 100) : 100;
  const duplicateRate = problems.length > 0 ? ((duplicateProblems.length / problems.length) * 100).toFixed(1) : 0;

  return {
    timestamp: new Date().toISOString(),
    totalProblems: problems.length,
    healthyProblems: healthyCount,
    failedProblems: problems.length - healthyCount,
    healthScore,
    totalTests,
    duplicateProblemsCount: duplicateProblems.length,
    duplicateRate: `${duplicateRate}%`,
    duplicateDetails: duplicateProblems,
    problemReports: results
  };
}

module.exports = {
  auditProblemHealth,
  auditEntireJudgeSystem
};
