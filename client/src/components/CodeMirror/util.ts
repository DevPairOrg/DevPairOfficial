export interface TestResults {
    testCase1: {assert: boolean, expected: any, userOutput: any}
    testCase2: {assert: boolean, expected: any, userOutput: any}
    testCase3: {assert: boolean, expected: any, userOutput: any}
}


// Function to perform type assertion
export function checkResponseData(data: any): data is TestResults {
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


export function isTestCase(data: any) {
    return (
        typeof data.assert === 'boolean' &&
        typeof data.expected !== 'undefined' &&
        typeof data.userOutput !== 'undefined'
    );
}
