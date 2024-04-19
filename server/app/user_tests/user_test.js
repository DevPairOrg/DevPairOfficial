function sumEvenAfterQueries(nums, queries) {
    // Your code goes here
}

const testCases = [
    {
        'input': {
            'nums': [1,2,3,4],
            'queries': [[1,0],[-3,1],[-4,0],[2,3]]
        },
        'expected': [8,6,2,4]
    },
    {
        'input': {
            'nums': [8,4,12], 
            'queries': [[1,0],[-1,1],[-5,1],[1,1]]
        },
        'expected': [14,10,6,8]
    }
];

testCases.forEach(({ input, expected }, index) => {
    const result = sumEvenAfterQueries(input.nums, input.queries);
    console.assert(arraysEqual(result, expected), `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, JSON.stringify(expected) === JSON.stringify(result));
});

function arraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}