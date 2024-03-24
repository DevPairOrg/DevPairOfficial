function largestNumber(s) {
    // Your code goes here
  return s.split('').sort((a, b) => b - a).join('');
}


const testCases = [
    {input: "102", expected: "210"},
    {input: "230241", expected: "432210"},
    {input: "9521203", expected: "9532210"}
];

testCases.forEach(({input, expected}, index) => {
    const result = largestNumber(input);
    console.assert(largestNumber(input) === expected, `Test case ${index + 1} failed`);
    console.log(`Test case ${index + 1}`, expected === result);
});