export function parseCode(code) {
  const lines = code.split("\n");
  let problemName = "";
  let problemPrompt = "";
  let emptyFunctionPython = "";
  let emptyFunctionJs = "";
  let testCases = "";
  let pythonUnitTest = "";
  let jsUnitTest = "";

  let inCodeBlock = false;
  let currentLanguage = "";

  const processedLines = lines.map((line: string) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("```")) {
      inCodeBlock = !inCodeBlock; // Toggle on entering or exiting a code block
      if (!inCodeBlock) {
        // We're exiting a code block, so clear the current language
        currentLanguage = "";
      }
      // Remove the code block markers, including the language identifier
      return "";
    }
    // Within a code block, we want to keep the content as is, but for processing, we might ignore it
    if (inCodeBlock) {
      // Optional: Process the line as code, if needed, depending on currentLanguage
      // For now, we're just keeping the line intact without modification
      return line;
    }
    // Return non-code block lines trimmed
    return trimmedLine;
  });

  // This handles the switch cases when iterating to the next line.
  // Example: once it hits 'PROBLEM NAME:'
  // 1. it sets currentSection = 'problemName'
  // 2. exits iteration to go to the next
  // 3. next iteration will now have a valid case based on 'currentSection' = 'problemName'
  // 4. case handles processes the line within the current iteration
  // 5. it continues to do this until reaching another section specified
  let currentSection = "";

  processedLines.forEach((line: string, i: number) => {
    if (line.startsWith("PROBLEM NAME:")) {
      currentSection = "problemName";
      return;
    } else if (line.startsWith("QUESTION PROMPT:")) {
      currentSection = "problemPrompt";
      return;
    } else if (
      line.startsWith("EMPTY FUNCTION:") ||
      line.startsWith("EMPTY FUNCTIONS:")
    ) {
      currentSection = "emptyFunction";
      return;
    } else if (line.startsWith("TEST CASES:")) {
      currentSection = "testCases";
      return;
    } else if (line.startsWith("PYTHON UNIT TESTING:")) {
      currentSection = "pythonUnitTest";
      return;
    } else if (line.startsWith("JAVASCRIPT UNIT TESTING:")) {
      currentSection = "jsUnitTest";
      return;
    }

    switch (currentSection) {
      case "problemName":
        problemName += line + "\n";
        break;
      case "problemPrompt":
        problemPrompt += line + "\n";
        break;
      case "emptyFunction":
        if (line.startsWith("def") && emptyFunctionPython === "") {
          emptyFunctionPython = captureFunctionBlock(lines, i, "Python");
        } else if (line.startsWith("function") && emptyFunctionJs === "") {
          emptyFunctionJs = captureFunctionBlock(lines, i, "JavaScript");
        }
        break;
      case "testCases":
        testCases += line + "\n";
        break;
      case "pythonUnitTest":
        pythonUnitTest += line + "\n";
        break;
      case "jsUnitTest":
        jsUnitTest += line + "\n";
        break;
      default:
        break;
    }
  });

  // Trim the final strings to remove unnecessary new lines
  problemPrompt = problemPrompt.trim();
  testCases = testCases.trim();
  pythonUnitTest = pythonUnitTest.trim();
  jsUnitTest = jsUnitTest.trim();

  console.log("Problem Name:", problemName);
  console.log("Problem Prompt:", problemPrompt);
  console.log("Empty Python Function:\n", emptyFunctionPython);
  console.log("Empty JavaScript Function:\n", emptyFunctionJs);
  console.log("Test Cases:\n", testCases);
  console.log("Python Unit Test:\n", pythonUnitTest);
  console.log("JavaScript Unit Test:\n", jsUnitTest);

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

// Function to capture the function block for Python or JavaScript
function captureFunctionBlock(lines, startIndex, language) {
  let functionBlock = "";
  for (let i = startIndex; i < lines.length; i++) {
    functionBlock += lines[i] + "\n";
    if (language === "Python" && lines[i].startsWith("def")) {
      // Capture until an unindented line or the end of lines
      let j = i + 1;
      while (
        j < lines.length &&
        (lines[j].startsWith("    ") || lines[j].trim() === "")
      ) {
        functionBlock += lines[j] + "\n";
        j++;
      }
      break; // End of Python function block
    } else if (language === "JavaScript" && lines[i].trim() === "}") {
      break; // End of JavaScript function block
    }
  }
  return functionBlock.trim();
}
