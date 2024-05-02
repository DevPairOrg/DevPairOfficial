function removeDuplicates(array) {
    // Your code goes here
    return "ASDFASDASD"
}


function runTests() {
    const testResults = {}

    const testCases = [
        {input: [1,1,2], expected: 2},
        {input: [0,0,1,1,1,2,2,3,3,4], expected: 5},
        {input: [1,2,3], expected: 3}
    ];

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    testCases.forEach(({ input, expected }, index) => {
        const result = removeDuplicates(input);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: arraysEqual(result, expected)}
    });

    return JSON.stringify(testResults)
}

const testResults = runTests()
console.log(testResults)
