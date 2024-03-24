function maxSubArray(nums) {
    // Your code goes here
  let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}


const testCases = [
    {input: [-2,1,-3,4,-1,2,1,-5,4], expected: 6},
    {input: [1], expected: 1},
    {input: [5,4,-1,7,8], expected: 23}
];

testCases.forEach(({input, expected}, index) => {
    const result = maxSubArray(input);
    console.assert(maxSubArray(input) === expected, `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, expected === result);
});