function twoSum(nums, target) {
    // Your code goes here
  return [0,1]
}


function runTests() {
    const testResults = {}

    const testCases = [
        {input: {nums: [2,7,11,15], target: 9}, expected: [0,1]},
        {input: {nums: [3,2,4], target: 6}, expected: [1,2]},
        {input: {nums: [3,3], target: 6}, expected: [0,1]}
    ];

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    testCases.forEach(({ input, expected }, index) => {
        const result = twoSum(input.nums, input.target);
        testResults[`testCase${index + 1}`] = {userOutput: result, expected: expected, assert: arraysEqual(result, expected)};
    });

    return JSON.stringify(testResults)
}

const testResults = runTests()
console.log(testResults)
