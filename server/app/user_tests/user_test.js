function searchInsert(nums, target) {
    // Your code goes here
  return 'abc'
}


const testCases = [
    {input: {nums: [1,3,5,6], target: 5}, expected: 2},
    {input: {nums: [1,3,5,6], target: 2}, expected: 1},
    {input: {nums: [1,3,5,6], target: 7}, expected: 4},
];

testCases.forEach(({input, expected}, index) => {
    const result = searchInsert(input.nums, input.target);
    console.assert(result === expected, `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, result === expected);
});