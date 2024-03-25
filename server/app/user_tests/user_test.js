function twoSum(nums, target) {
    // Your code goes here
  const map = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map[complement] !== undefined) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }
}


const testCases = [
    {input: [2, 7, 11, 15], target: 9, expected: [0, 1]},
    {input: [3, 2, 4], target: 6, expected: [1, 2]},
    {input: [3, 3], target: 6, expected: [0, 1]}
];

testCases.forEach(({input, expected}, index) => {
    console.assert(twoSum(input, target) === expected, `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, expected === result ? 'passed' : 'failed');
});