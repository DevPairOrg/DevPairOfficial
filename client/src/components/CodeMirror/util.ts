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



// SETUP FOR CSS

function parseParams(input: string) {
    // Remove brackets and split by comma
    return input ? input.substring(1, input.length - 1).split(",") : [];
}

function setupTestParams(inputString: string) {
    const inputs = inputString.split("- INPUT: ");
    const testParams: any = {};

    inputs.forEach((input, index) => {
        if (index === 0) return; // Skip the first empty string
        const lines = input.trim().split("\n");
        if (lines.length < 2) return; // Skip if there's not enough lines
        const inputParams = parseParams(lines[0].split(": ")[1]);
        const outputParams = parseParams(lines[1].split(": ")[1]);
        const testParamsIndex = "testParams" + index;

        testParams[testParamsIndex] = {};

        inputParams.forEach((param, paramIndex) => {
            testParams[testParamsIndex][paramIndex] = param === "null" ? null : param;
        });

        testParams[testParamsIndex]['output'] = outputParams.map(param => param === "null" ? null : param);
    });

    return testParams;
}

// Example usage:
const inputString = `
- INPUT: [1,3,2,5],[2,1,3,null,4,null,7]
- OUTPUT: [3,4,5,5,4,null,7]
- INPUT: [1],[1,2]
- OUTPUT: [2,2]
- INPUT: null,null
- OUTPUT: []
`;

const testParams = setupTestParams(inputString);
console.log("ASDASDASD", testParams);
