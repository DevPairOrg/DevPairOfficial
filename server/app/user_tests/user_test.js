function addTwoNumbers(l1, l2) {
    // Your code goes here
    return [7,0,8]
}


function runTests() {
    const testResults = {}

    const testCases = [
        {input: [[2,4,3], [5,6,4]], expected: [7,0,8]},
        {input: [[0], [0]], expected: [0]},
        {input: [[9,9,9,9,9,9,9], [9,9,9,9]], expected: [8,9,9,9,0,0,0,1]}
    ];

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    testCases.forEach(({ input, expected }, index) => {
        const result = addTwoNumbers(...input);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: arraysEqual(result, expected)}
    });

    return JSON.stringify(testResults)
}

const testResults = runTests()
console.log(testResults)
