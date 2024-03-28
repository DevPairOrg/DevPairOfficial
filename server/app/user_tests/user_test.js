function isPalindrome(x) {
    // Your code goes here
   if (x < 0) return false;
    let reverse = 0, y = x;
    while (y > 0) {
        const lastDigit = y % 10;
        reverse = (reverse * 10) + lastDigit;
        y = Math.floor(y / 10);
    }
    console.log('test', reverse)
    return x === reverse;
}


const testCases = [
    { input: 121, expected: true },
    { input: -121, expected: false },
    { input: 10, expected: false }
];

testCases.forEach(({ input, expected }, index) => {
    const result = isPalindrome(input);
    console.assert(result === expected, `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, result === expected);
});
