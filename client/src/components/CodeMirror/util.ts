
// HANDLE CODE SUBMISSION FETCH FUNCTION ----------------------------------------------------------------------

export const handleCodeSubmission = async (
    value: string | undefined,
    jsUnitTest: string | undefined,
    language: string,
    pythonUnitTest: string | undefined,
    setUserResults: React.Dispatch<React.SetStateAction<TestResults | null>>,
    setTestCaseView: React.Dispatch<React.SetStateAction<number | null>>,
    openConsoleOutputModal: () => void

    ) => {
    let valWithoutLogs;
    if (language === 'javascript' && value) {
        // Remove console.log statements from the function definition for JavaScript
        valWithoutLogs = value.replace(/console\.log\s*\([^]*?\)\s*;?/g, '')
    }

    try {
        const response = await fetch('/api/problem/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                code: language !== 'python' ? valWithoutLogs : value, // do not pass console.log to backend if your using JavaScript IDE
                language: language,
                problemUnitTest: language === 'python' ? pythonUnitTest : jsUnitTest,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();
        let testResults: any

        if(language !== 'python') {
            testResults = JSON.parse(data.testResults) // additional conversion needed for JavaScript
        } else {
            testResults = data.testResults;
        }

        const hasDigestibleResults = checkResponseData(testResults);

        if (hasDigestibleResults) {
            setUserResults(testResults);
            setTestCaseView(1)
            openConsoleOutputModal()
        } else {
            console.error('An error occured generating test result data');
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
};

// -----------------------------------------------------------------------------------------------------------




// HANDLE CODE SUBMISSION HELPERS ----------------------------------------------------------------------------

export interface TestResults {
    testCase1: {assert: boolean, expected: any, userOutput: any}
    testCase2: {assert: boolean, expected: any, userOutput: any}
    testCase3: {assert: boolean, expected: any, userOutput: any}
}


// Function to perform type assertion
function checkResponseData(data: any): data is TestResults {
    return (
        // Check if test cases exist and have the correct structure
        data.hasOwnProperty('testCase1') &&
        data.hasOwnProperty('testCase2') &&
        data.hasOwnProperty('testCase3') &&
        // Check the structure of each test case
        isTestCase(data.testCase1) &&
        isTestCase(data.testCase2) &&
        isTestCase(data.testCase3)
    );
}


function isTestCase(data: any) {
    return (
        typeof data.assert === 'boolean' &&
        typeof data.expected !== 'undefined' &&
        typeof data.userOutput !== 'undefined'
    );
}

// -----------------------------------------------------------------------------------------------------------




// STOUDT & IDE RELATED --------------------------------------------------------------------------------------

export const extractConsoleLogsJavaScriptOnly = (functionDefinition: string) => {
    try {
        // Define an array to store evaluated console.log() statements
        const evaluatedLogs: string[] = [];

        // Construct a real function using the function string
        const func = Function(`return (${functionDefinition})`)();

        const originalConsoleLog = console.log; //! CRUCIAL -- DO NOT TOUCH... this stores the normal behavior of the global console.log function
        //* Override console.log to capture its output
        console.log = function(...args: any[]) {
            evaluatedLogs.push(args.join(' '));
            // originalConsoleLog.apply(console, args);
        };

        // Execute the function
        func();

        console.log = originalConsoleLog; //! CRUCIAL -- DO NOT TOUCH... Restores the original console.log function

        // Now, evaluatedLogs array contains the evaluated console.log() statements
        return evaluatedLogs
    } catch (error) {
        // console.error('Error evaluating function string:', error);
        //? commented out because its going to send out an error each time the IDE has any syntax error. But can uncomment for debugging
        return null
    }
}

// Python or Javascript User Options ----------------------------------------------------------------------------

    export const handlePythonButton = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        setLanguage: React.Dispatch<React.SetStateAction<string>>,
        setValue: React.Dispatch<React.SetStateAction<string | undefined>>,
        defaultPythonFn: string | undefined
        ) => {
        e.preventDefault();
        setLanguage('python');
        setValue(defaultPythonFn);
    };
    export const handleJavascriptButton = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        setLanguage: React.Dispatch<React.SetStateAction<string>>,
        setValue: React.Dispatch<React.SetStateAction<string | undefined>>,
        defaultJsFn: string | undefined
        ) => {
        e.preventDefault();
        setLanguage('javascript');
        setValue(defaultJsFn);
    };


// -------------------------------------------------------------------------------------------------------------




// Parse Gemini Test Cases ------------------------------------------------------------------------------------

import { TestCase } from "../../interfaces/gemini";
export interface TestParams {
    paramsTestCase1: string
    paramsTestCase2: string
    paramsTestCase3: string
}

export function parsedTestCases(testCases: TestCase[] | undefined) {
    if(testCases) {
        return {paramsTestCase1: testCases[0].INPUT, paramsTestCase2: testCases[1].INPUT, paramsTestCase3: testCases[2].INPUT}
    } else {
        return {}
    }
}

// -------------------------------------------------------------------------------------------------------------




//? NEW SUBMISSION USING JUDGE0 ---------------------------------------------------------------------------------

export const createJSSubmissionOnLocal = async () => {
    const url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': import.meta.env.VITE_X_AUTH_TOKEN,
            'X-Auth-User': import.meta.env.VITE_X_AUTH_USER,
            // 'X-Auth-Host': 'http://146.190.61.177:2358',
        },
        body: JSON.stringify({
            source_code: `
                const input = require('fs').readFileSync(0, 'utf-8').trim().split(' ');
                const a = parseInt(input[0].split('=')[1]);
                const b = parseInt(input[1].split('=')[1]);
                console.log(twoSum(a, b));

                function twoSum(a, b) {
                    const sum = a + b
                    console.log('Test Console Log', sum)
                    return a + b;
                }
            `,
            language_id: 63,
            stdin: 'a=5 b=3',
            expected_output: '8',
        }),
    };
    try {
        const response = await fetch(url, options as any);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};


// ! For Python: Must Include 'additional_files': sys
// ! This is so the 'import sys' in the source code actually works correctly
export const createPySubmissionOnLocal = async () => {
    const url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': import.meta.env.VITE_X_AUTH_TOKEN,
            'X-Auth-User': import.meta.env.VITE_X_AUTH_USER,
            // 'X-Auth-Host': 'http://146.190.61.177:2358',
        },
        body: JSON.stringify({
            additional_files: 'sys',
            // !!! FOR PYTHON YOU HAVE TO USE THIS INDENTATION LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
            source_code: `
                import sys
                def two_sum(a, b):
                    sum_value = a + b
                    return sum_value

                input_data = sys.stdin.read().strip().split(' ')
                a = int(input_data[0].split('=')[1])
                b = int(input_data[1].split('=')[1])

                print(two_sum(a, b))
            `,
            language_id: 71,
            stdin: 'a=5 b=3',
            expected_output: '8',
        }),
    };
    try {
        const response = await fetch(url, options as any);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

//? ------------------------------------------------------------------------------------------------------
