function findPeakElement(nums) {
    // Your code goes here
  return '5'
}

function runTests() {

    const testResults = {}

    const testCases = [
        {input: {nums: [1,2,3,1]}, expected: 2},
        {input: {nums: [1,2,1,3,5,6,4]}, expected: 5},
        {input: {nums: [1,2,3]}, expected: 2}
    ];

    testCases.forEach(({ input, expected }, index) => {
        const result = findPeakElement(input.nums);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: result === expected};
    });

    return testResults

}

const testResults = runTests()

console.log(`${testResults["testCase1"]["userOutput"]} NEXT ELEMENT ${testResults["testCase1"]["expected"]} NEXT ELEMENT ${testResults["testCase1"]["assert"]} NEXT ELEMENT ${testResults["testCase1"]["userOutput"]} NEXT ELEMENT ${testResults["testCase2"]["expected"]} NEXT ELEMENT ${testResults["testCase3"]["assert"]} NEXT ELEMENT ${testResults["testCase1"]["userOutput"]} NEXT ELEMENT ${testResults["testCase2"]["expected"]} NEXT ELEMENT ${testResults["testCase3"]["assert"]} NEXT ELEMENT`);
