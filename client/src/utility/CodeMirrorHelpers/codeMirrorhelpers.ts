// *INTERFACES
export interface CaseParameters {
  INPUT: string;
  OUTPUT: string;
}

export interface TestResult {
  stdin?: any;
  expectedOutput?: any;
  userOutput?: any;
  assert?: any;
  result?: any;
  stdout?: any;
  stderr?: any;
  exitCode?: any;
}

export interface JudgeResults {
  [key: string]: TestResult;
}

// *SWITCH IDE LANGUAGE
export const handlePythonButton = (
  setLanguage: React.Dispatch<React.SetStateAction<string>>,
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>,
  defaultPythonFn: string | undefined
) => {
  setLanguage("python");
  setValue(defaultPythonFn);
};

export const handleJavascriptButton = (
  setLanguage: React.Dispatch<React.SetStateAction<string>>,
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>,
  defaultJsFn: string | undefined
) => {
  setLanguage("javascript");
  setValue(defaultJsFn);
};

// JUDGE SUBMISSION HELPERS
function grabFunctionName(sourceCode: string | undefined, language: string) {
  if (!sourceCode) return;

  // Extracting function name AS SEEN from source code
  const regex =
    language === "javascript" ? /function\s+(\w+)\s*\(/ : /def\s+(\w+)\s*\(/;
  const match = sourceCode.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

export const createJSSubmissionOnLocal = async (
  sourceCode: string | undefined,
  stdin: string | undefined,
  expectedOutput: string | undefined
) => {
  const correctFunctionName = grabFunctionName(sourceCode, "javascript");
  const url =
    "http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": import.meta.env.VITE_X_AUTH_TOKEN,
      "X-Auth-User": import.meta.env.VITE_X_AUTH_USER,
    },
    body: JSON.stringify({
      source_code: `
                const input = require('fs').readFileSync(0, 'utf-8').trim();
                const eachParam = input.split(';')

                function stringifyObjectData(objectString) { // NEEDS TO BE JAVASCRIPT COMPILED SYNTAX DEFINITION
                    objectString = objectString.trim();

                    if (objectString[0] !== '{' || objectString[objectString.length - 1] !== '}') {
                        console.error('Input is not a valid JSON-like object.');
                        return null;
                    }

                    objectString = objectString.substring(1, objectString.length - 1).trim();
                    const parts = objectString.split(',');

                    const fixedParts = parts.map((part) => {
                        const colonIndex = part.indexOf(':');

                        if (colonIndex > 0 && colonIndex < part.length - 1) {
                            const key = part.slice(0, colonIndex).trim();
                            const value = part.slice(colonIndex + 1).trim();

                            if (!key.startsWith('"') && !key.endsWith('"')) {
                                return \`"\${key}": \${value}\`;
                            }
                        }

                        return part.trim();
                    });

                    return \`{\${fixedParts.join(',')}}\`;
                }


                //! console.log("EACH PARAM", eachParam) // <--- FOR DEBUGGING
                const parsedTypesParamsArray = eachParam.map((param) => {
                    param = param.split("=")[1]
                    let parsedParam;

                    if(param.includes('{') || param.includes('}')) {
                        const objectData = stringifyObjectData(param)
                        parsedParam = JSON.parse( objectData )
                    } else {
                        parsedParam = JSON.parse( param.trim() )
                    }

                    return parsedParam
                })

                //! console.log("PARSED TYPES ARR --->", parsedTypesParamsArray) // <--- FOR DEBUGGING

                console.log(${correctFunctionName}(...parsedTypesParamsArray))
                ${sourceCode}

            `,
      language_id: 63,
      stdin: stdin,
      expected_output: expectedOutput,
    }),
  };
  try {
    const response = await fetch(url, options as any);
    const result = await response.json();
    // console.log("RESULT", result)
    return result;
  } catch (error) {
    console.error(error);
  }
};

// ! For Python: Must Include 'additional_files': sys
// ! This is so the 'import sys' in the source code actually works correctly
export const createPySubmissionOnLocal = async (
  sourceCode: string | undefined,
  stdin: string,
  expectedOutput: string
) => {
  if (sourceCode) {
    const functionName = grabFunctionName(sourceCode, "python");
    // PYTHON SOURCE CODE BLOCK
    // import inspect

    // stdin = input().strip()
    // parameters = stdin.split(";")

    // for param in parameters:
    //   # This will execute the parameters as if they were python code
    //   # For example, if the input is 'a=1', this will declare 'a=1'
    //   exec(param.strip(), globals())

    // ${sourceCode}

    // # saves the parameters of the function into a variable called 'params'
    // params = inspect.signature(${functionName}).parameters

    // # Create a dictionary that maps parameter names to their values
    // args = {name: globals()[name] for name in params.keys()}

    // # Call the function with the arguments
    // print(${functionName}(**args))
    const url =
      "http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": import.meta.env.VITE_X_AUTH_TOKEN,
        "X-Auth-User": import.meta.env.VITE_X_AUTH_USER,
      },
      body: JSON.stringify({
        additional_files: "sys, inspect",
        source_code: `import sys\nimport inspect\nstdin = sys.stdin.readline().strip()\nparameters = stdin.split(";")\nfor param in parameters:\n    exec(param.strip(), globals())\n\n${sourceCode}\n\nparams = inspect.signature(${functionName}).parameters\n\nargs = {name: globals()[name] for name in params.keys()}\nprint(${functionName}(**args))\n`,
        language_id: 71,
        stdin: stdin,
        expected_output: expectedOutput,
      }),
    };

    try {
      const response = await fetch(url, options as any);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};

// ----------------------------------------------------------------------------------------------------------------------------------------------------------
// ***** LANGUAGE CODES: 71 (python) 63 (javascript) 93(javascript but this one is unavailable on local) *****
// * Create a submission - use base64_encoded=false&wait=true - wait=true grabs the results and returns it right away instead returning a token for you to use to hit another route to retrieve the results
// TODO: Figure out how to utilize multiple input / outputs
// ? Must include Post Method, Auth Token/User/Content-Type
// ? Body must be JSON.stringify

// * (Start of important comments)
// !!! the function stdin is being parsed because although the function being passed in has parameters (a, b) it's actually function twoSum(input) where 'input' is a string intiially
// Therefore, we have to trim, split the input (stdin) into an array [a, b]
// Then parse them into integers and reassigning them into proper variables
// const a = parseInt(input[0]) and const b = parseInt(input[1])
// Finally we use those variables to match the parameters of function twoSum(a, b)
// !!! IMPORTANT !!! results will only return correctly if we add a console.log(twoSum(a,b))
// * (End of important comments)

// TODO: Figure out an efficient way to have gemini parse this for us intially for the test case, or for it to not have to trim/split/parse and how to do it for arrays
// TODO: Figure out how to capture console.logs - when console.log is added to the user function and is submitted, it returns in the key 'stdout' along with the return value
// Example: "stdout": "Test Console Log\n8"
// ? Maybe tell users to remove console.logs before finalizing their submission (create a 'run' button that is separate from 'submission')
// ----------------------------------------------------------------------------------------------------------------------------------------------------------

//*  JUDGE0 SUBMISSION FETCH
export const handleJudgeSubmission = async (
  sourceCode: string | undefined,
  language: string,
  testCases: CaseParameters[] | undefined
) => {
  if (!testCases || !sourceCode) return;

  let judgeResults: JudgeResults = {
    testCase1: {},
    testCase2: {},
    testCase3: {},
  };

  if (language === "javascript") {
    for (const [index, test] of testCases.entries()) {
      const result = await createJSSubmissionOnLocal(
        sourceCode,
        test.INPUT,
        test.OUTPUT
      );

      judgeResults[`testCase${index + 1}`] = {
        stdin: result.stdin,
        expectedOutput: result.expected_output,
        result: result.status.description,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exit_code,
      };
    }

    return judgeResults;
  } else if (language === "python") {
    for (const[index, test] of testCases.entries()) {
      console.log("Submission for Python", test);
      const result = await createPySubmissionOnLocal(
        sourceCode,
        test.INPUT,
        test.OUTPUT
      );
      judgeResults[`testCase${index + 1}`] = ({
        stdin: result.stdin,
        expectedOutput: result.expected_output,
        result: result.status.description,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exit_code,
      });
    }
    return judgeResults;
  }
};

// POST JUDGE SUBMISSION HELPERS

export function seperateLogsAndUserOutputFromStdout(
  judgeResults: JudgeResults
) {
  for (let key in judgeResults) {
    const testCase = judgeResults[key];
    const stoudt = testCase.stdout;
    const seperatedStoudt = stoudt.split("\n");

    const stoudtLogs = seperatedStoudt.splice(0, seperatedStoudt.length - 2);

    let userOutput; // parse userOutput only if its not undefined or null

    if(seperatedStoudt[seperatedStoudt.length - 2] === 'undefined' || seperatedStoudt[seperatedStoudt.length - 2] === 'null') {
      userOutput = undefined
    } else {
      userOutput = JSON.parse(seperatedStoudt[seperatedStoudt.length - 2]);
    }

    testCase.stdout = stoudtLogs;
    testCase.userOutput = userOutput;
  }
}

export function assertResults(judgeResults: JudgeResults) {
  for (let key in judgeResults) {
    const testCase = judgeResults[key];

    const expectedOutput = testCase.expectedOutput; // *still needs to be parsed with JSON.parse()
    const userOutput = testCase.userOutput;

    if (expectedOutput.includes("{") || expectedOutput.includes("}")) {
      // strict compare 2 objects
      const objectData = stringifyObjectData(expectedOutput);
      if (objectData) {
        const parsedData = JSON.parse(objectData);
        testCase.assert = strictEqualObjects(userOutput, parsedData);
      }
    } else if (expectedOutput.includes("[") || expectedOutput.includes("]")) {
      // strict compare 2 arrays
      const parsedData = JSON.parse(expectedOutput);
      testCase.assert = arraysAreEqual(userOutput, parsedData);
    } else {
      // string, boolean, and number types
      const parsedData = JSON.parse(expectedOutput);
      testCase.assert = userOutput === parsedData;
    }
  }
}

function stringifyObjectData(objectString: string) {
  // when test case paramaters are objects, or the expected output is an object, we can use this function to convert object string data to the correct stringified format
  // to get our objects to work with JSON.parse()
  objectString = objectString.trim();

  if (
    objectString[0] !== "{" ||
    objectString[objectString.length - 1] !== "}"
  ) {
    console.error("Input is not a valid JSON-like object.");
    return null;
  }

  objectString = objectString.substring(1, objectString.length - 1).trim();
  const parts = objectString.split(",");

  const fixedParts = parts.map((part) => {
    const colonIndex = part.indexOf(":");

    if (colonIndex > 0 && colonIndex < part.length - 1) {
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();

      if (!key.startsWith('"') && !key.endsWith('"')) {
        return `"${key}": ${value}`;
      }
    }

    return part.trim();
  });

  return `{${fixedParts.join(",")}}`;
}

function arraysAreEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const element1 = arr1[i];
    const element2 = arr2[i];

    if (Array.isArray(element1) && Array.isArray(element2)) {
      if (!arraysAreEqual(element1, element2)) {
        return false;
      }
    } else if (typeof element1 === "object" && typeof element2 === "object") {
      if (!objectsAreEqual(element1, element2)) {
        return false;
      }
    } else {
      if (element1 !== element2) {
        return false;
      }
    }
  }

  return true;
}

function objectsAreEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === "object" && typeof val2 === "object") {
      if (!objectsAreEqual(val1, val2)) {
        return false;
      }
    } else {
      if (val1 !== val2) {
        return false;
      }
    }
  }

  return true;
}

function strictEqualObjects(obj1: any, obj2: any) {
  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!strictEqualObjects(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (
      !obj2.hasOwnProperty(key) ||
      !strictEqualObjects(obj1[key], obj2[key])
    ) {
      return false;
    }
  }

  return true;
}


// Adding DSA Problem To User Model

export const allTestCasesPassed = (userResults: JudgeResults | null): boolean => {
    if(!userResults) return false

    return (
        userResults.testCase1.assert &&
        userResults.testCase2.assert &&
        userResults.testCase3.assert
    );
};


export const addDSAProblemToUserSolved = async (userId: string | undefined, prompt: string | undefined) => {
    if(!userId || !prompt) return

    const response = await fetch('/api/gemini/add', {
        method: "POST",
        body: JSON.stringify({userId, prompt}),
        headers: { "Content-Type": "application/json"}
    })

    if(!response.ok) {
        console.error("Something Went Wrong inside /api/gemini/add from addDSAProblemToUserSolved fetch call")
    }
}
