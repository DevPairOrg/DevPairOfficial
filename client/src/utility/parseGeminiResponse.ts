export function parseCode(code: string) {
  const lines = code.split("\n");
  let problemName = "";
  let problemPrompt = "";
  let defaultPythonFn = "";
  let defaultJsFn = "";
  let testCases = "";
  let pythonUnitTest = "";
  let jsUnitTest = "";

  // let inCodeBlock = false;
  // let currentLanguage = "";
  let preserveIndentation = false;

  // This method is to properly remove any backticks "```" or "```javascript" or "```python" since the regex method did not work consistently
  // const processedLines = lines.map((line: string) => {
  //   const trimmedLine = line.trim();
  //   if (trimmedLine.startsWith("```")) {
  //     inCodeBlock = !inCodeBlock;
  //     if (!inCodeBlock) {
  //       currentLanguage = "";
  //     }
  //     return "";
  //   }
  //   if (inCodeBlock) {
  //     return line;
  //   }
  //   return trimmedLine;
  // });

  const processedLines = lines.map((line: string) => {
    if (
      line.trim().startsWith("PYTHON UNIT TESTING:") ||
      line.trim().startsWith("JAVASCRIPT UNIT TESTING:") ||
      line.trim().startsWith("```")
    ) {
      preserveIndentation = true;
    }

    if (preserveIndentation) {
      // If we're preserving indentation, return the line unmodified
      return line;
    } else {
      // Otherwise, trim the line to remove leading and trailing whitespace
      return line.trim();
    }
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
        if (line.startsWith("def") && defaultPythonFn === "") {
          defaultPythonFn = captureFunctionBlock(lines, i);
        } else if (line.startsWith("function") && defaultJsFn === "") {
          defaultJsFn = captureFunctionBlock(lines, i);
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
  pythonUnitTest = pythonUnitTest;
  jsUnitTest = jsUnitTest;

  // console.log("Problem Name:\n", problemName);
  // console.log("Problem Prompt:\n", problemPrompt);
  // console.log("Empty Python Function:\n", defaultPythonFn);
  // console.log("Empty JavaScript Function:\n", defaultJsFn);
  // console.log("Test Cases:\n", testCases);
  // console.log("Python Unit Test:\n", pythonUnitTest);
  // console.log("JavaScript Unit Test:\n", jsUnitTest);

  return {
    problemName,
    problemPrompt,
    defaultPythonFn,
    defaultJsFn,
    testCases,
    pythonUnitTest,
    jsUnitTest,
  };
}

// Function to capture the function block for Python or JavaScript
function captureFunctionBlock(lines: string[], startIndex: number) {
  let functionBlock = "";

  for (let i = startIndex; i < lines.length; i++) {
    // Append the lines
    functionBlock += lines[i] + "\n";

    // Break out of loop and return the functionBlock as soon as it finds an unindented line or the end of lines for python or a closing bracket for javascript
    if (lines[i].startsWith("def")) {
      let j = i + 1;
      while (
        j < lines.length &&
        (lines[j].startsWith("    ") || lines[j].trim() === "")
      ) {
        functionBlock += lines[j] + "\n";
        j++;
      }
      break;
    } else if (lines[i].trim() === "}") {
      break;
    }
  }
  return functionBlock.trim();
}
