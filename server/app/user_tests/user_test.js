function findDuplicate(nums) {
    // Your code goes here
  return 2
}

function runTests() {

    const testResults = {}

    const testCases = [
        {input: [1,3,4,2,2], expected: 2},
        {input: [3,1,3,4,2], expected: 3},
        {input: [1,1], expected: 1}
    ];

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    testCases.forEach(({ input, expected }, index) => {
        const result = findDuplicate(input);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: result === expected};
    });

    return JSON.stringify(testResults)

}

const testResults = runTests()
console.log(testResults)
