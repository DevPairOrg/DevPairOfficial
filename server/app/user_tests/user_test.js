function mergeTwoLists(l1, l2) {
    // Your code goes here
    return "STDFS"
}


function runTests() {
    const testResults = {}

    const testCases = [
        {input: {l1: [1,2,4], l2: [1,3,4]}, expected: [1,1,2,3,4,4]},
        {input: {l1: [], l2: []}, expected: []},
        {input: {l1: [], l2: [0]}, expected: [0]}
    ];

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    testCases.forEach(({ input, expected }, index) => {
        const result = mergeTwoLists(input.l1, input.l2);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: arraysEqual(result, expected)};
    });

    return JSON.stringify(testResults)
}

const testResults = runTests()
console.log(testResults)
