export function parseCode(code: string) {
  const lines = code.split("\n");
  let problemName = "";
  let problemPrompt = "";
  let emptyFunctionPython = "";
  let emptyFunctionJs = "";
  let testCases = "";
  let pythonUnitTest = "";
  let jsUnitTest = "";
  let isProblemPromptSection = false;
  let isPythonSection = false;
  let isJsSection = false;
  let isTestCaseSection = false;
  let isEmptyFunctionSection = false;
  let isProblemName = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
      .trim()
      .replace(/\*|`/g, "")
      .replace(/```javascript|```python|```/g, "");

    if (line.startsWith("PROBLEM NAME:")) {
      isProblemName = true;
      continue;
    }

    if (line.startsWith("QUESTION PROMPT:")) {
      isProblemPromptSection = true;
      isProblemName = false;
      continue;
    }

    if (line === "EMPTY FUNCTION:" || line === "EMPTY FUNCTIONS:") {
      isEmptyFunctionSection = true;
      isProblemPromptSection = false;
      isProblemName = false;
      continue;
    }

    if (line === "TEST CASES:") {
      isTestCaseSection = true;
      isEmptyFunctionSection = false;
      isProblemPromptSection = false;
      isProblemName = false;
      continue;
    }

    if (line === "PYTHON UNIT TESTING:") {
      isTestCaseSection = false;
      isPythonSection = true;
      isJsSection = false;
      isProblemPromptSection = false;
      isProblemName = false;
      continue; // Skip the heading line
    }

    if (line === "JAVASCRIPT UNIT TESTING:") {
      isJsSection = true;
      isPythonSection = false; // Ensure Python section is disabled
      isTestCaseSection = false;
      isProblemPromptSection = false;
      isProblemName = false;
      continue; // Skip the heading line
    }

    // Section: Handle if conditionals above depending on if it's true or false

    if (isProblemName) {
      problemName += line;
    }

    if (isProblemPromptSection) {
      problemPrompt += lines[i].trim() + "\n";
    }

    if (isEmptyFunctionSection) {
      if (line.startsWith("def") && emptyFunctionPython === "") {
        emptyFunctionPython += line + "\n"; // Add the current line
        let j = i + 1;
        while (
          j < lines.length &&
          (lines[j].startsWith("    ") || lines[j].trim() === "")
        ) {
          emptyFunctionPython += lines[j] + "\n";
          j++;
        }
        i = j - 1; // Skip the processed lines
      } else if (line.startsWith("function") && emptyFunctionJs === "") {
        emptyFunctionJs += line + "\n"; // Add the current line
        let j = i + 1;
        while (j < lines.length && lines[j].trim() !== "}") {
          emptyFunctionJs += lines[j] + "\n";
          j++;
        }
        if (j < lines.length && lines[j].trim() === "}") {
          emptyFunctionJs += lines[j] + "\n"; // Include the closing bracket
        }
        i = j; // Skip the processed lines
      }
      // Logic to transition out of isEmptyFunctionSection
      if (
        emptyFunctionPython &&
        (line.includes("TEST CASES:") ||
          line.includes("PYTHON UNIT TESTING:") ||
          line.includes("JAVASCRIPT UNIT TESTING:"))
      ) {
        // Set to false if we've captured the Python function and are transitioning to another section
        isEmptyFunctionSection = false;
      }
    }

    // Accumulate Test Cases
    if (isTestCaseSection) {
      testCases += lines[i] + "\n";
    }

    // Accumulate Python Unit Test
    if (isPythonSection) {
      pythonUnitTest += lines[i] + "\n";
    }

    // Accumulate JavaScript Unit Test
    if (isJsSection) {
      jsUnitTest += lines[i] + "\n";
    }
  }

  // Trim the final strings to remove unnecessary new lines
  problemPrompt = problemPrompt.trim();
  testCases = testCases.trim();
  pythonUnitTest = pythonUnitTest.trim();
  jsUnitTest = jsUnitTest.trim();

  console.log("name\n", problemName);
  console.log("prompt\n", problemPrompt);
  console.log("Empty Python Function\n", emptyFunctionPython);
  console.log("Empty JavaScript Function\n", emptyFunctionJs);
  console.log("test cases\n", testCases);
  console.log("python unit test\n", pythonUnitTest);
  console.log("js unit test\n", jsUnitTest);

  return {
    problemName,
    problemPrompt,
    emptyFunctionPython,
    emptyFunctionJs,
    testCases,
    pythonUnitTest,
    jsUnitTest,
  };
}
