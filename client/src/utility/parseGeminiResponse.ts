export function parseCode(code: string) {
    const lines = code.split('\n');
    let problemName = '';
    let problemPrompt = '';
    let defaultPythonFn = '';
    let defaultJsFn = '';
    let testCases = '';
    let pythonUnitTest = '';
    let jsUnitTest = '';

    let inCodeBlock = false;
    let preserveIndentation = false;

    const processedLines = lines.map((line: string) => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock; // Enter or exit code block
            preserveIndentation = inCodeBlock; // Enable or disable based on code block status
            return ''; // Skip ``` lines themselves
        }

        // Additional conditions here...

        if (inCodeBlock || preserveIndentation) {
            // Return line unchanged if in a code block or preserving indentation
            return line;
        } else {
            // Apply other transformations when not preserving indentation
            if (line.trim().startsWith('**')) {
                return line.trim().replace(/\*\*/g, '').trim();
            } else if (line.trim().startsWith('#')) {
                return line.replace(/#/g, '').trim();
            }

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
    let currentSection = '';

    processedLines.forEach((line: string, i: number) => {
        if (line.startsWith('PROBLEM NAME:')) {
            currentSection = 'problemName';
            return;
        } else if (line.startsWith('QUESTION PROMPT:')) {
            currentSection = 'problemPrompt';
            return;
        } else if (line.startsWith('EMPTY FUNCTION:') || line.startsWith('EMPTY FUNCTIONS:')) {
            currentSection = 'defaultFunction';
            return;
        } else if (line.startsWith('TEST CASES:')) {
            currentSection = 'testCases';
            return;
        } else if (line.startsWith('PYTHON UNIT TESTING:')) {
            currentSection = 'pythonUnitTest';
            return;
        } else if (line.startsWith('JAVASCRIPT UNIT TESTING:')) {
            currentSection = 'jsUnitTest';
            return;
        }

        switch (currentSection) {
            case 'problemName':
                problemName += line + '\n';
                break;
            case 'problemPrompt':
                problemPrompt += line + '\n';
                break;
            case 'defaultFunction':
                if (line.startsWith('def') && defaultPythonFn === '') {
                    defaultPythonFn = captureFunctionBlock(lines, i, 'python');
                } else if (line.startsWith('function') && defaultJsFn === '') {
                    defaultJsFn = captureFunctionBlock(lines, i, 'javascript');
                }
                break;
            case 'testCases':
                testCases += line + '\n';
                break;
            case 'pythonUnitTest':
                pythonUnitTest += line + '\n';
                break;
            case 'jsUnitTest':
                jsUnitTest += line + '\n';
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

    console.log('Problem Name:\n', problemName);
    console.log('Problem Prompt:\n', problemPrompt);
    console.log('Default Python Function:\n', defaultPythonFn);
    console.log('Default JavaScript Function:\n', defaultJsFn);
    console.log('Test Cases:\n', testCases);
    console.log('Python Unit Test:\n', pythonUnitTest);
    console.log('JavaScript Unit Test:\n', jsUnitTest);

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
function captureFunctionBlock(lines: string[], startIndex: number, language: string) {
    let functionBlock = '';
    let braceCount = 0; // Only used for JavaScript
    let pythonIndentation = null; // Only used for Python

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];

        // For JavaScript, track opening and closing braces
        if (language === 'javascript') {
            // Adjust braceCount for JS
            if (line.includes('{')) braceCount++;
            if (line.includes('}')) braceCount--;

            functionBlock += line + '\n';
            if (braceCount === 0 && line.includes('}')) break; // Stop capturing after closing the function block
        }

        // For Python, detect indentation level to determine block end
        if (language === 'python') {
            if (line.trim().startsWith('def ') && pythonIndentation === null) {
                // Capture the indentation level of the function definition
                pythonIndentation = line.indexOf('def');
            } else if (pythonIndentation !== null) {
                // Check if the current line is less indented than the function start or a new function/JS function starts
                let currentIndentation = line.search(/\S/); // Find the first non-whitespace character
                if (currentIndentation <= pythonIndentation || line.includes('function')) {
                    break; // End capturing the Python block
                }
            }
            functionBlock += line + '\n';
        }
    }

    return functionBlock.trimEnd(); // Remove the last newline for consistency
}
