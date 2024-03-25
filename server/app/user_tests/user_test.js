function groupAnagrams(strs) {
    // Your code goes here
  const group = {}

for(let i = 0; i < strs.length; i++) {
  const arr = strs[i].split("")
  const sortedStr = arr.sort().join("")
  if(group[sortedStr]) {
    group[sortedStr].push(strs[i])
  } else {
    group[sortedStr] = [strs[i]]
  }
}

let result = []
for(let key in group) {
  result.push(group[key])
}
return result
  
}


const testCases = [
  {input: ["eat", "tea", "tan", "ate", "nat", "bat"], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]},
  {input: [""], expected: [[""]]},
  {input: ["a"], expected: [["a"]]}
];

testCases.forEach(({input, expected}, index) => {
  const result = groupAnagrams(input);
  const arraysAreEqual = result.length === expected.length && result.every((value, i) => value.sort().join() === expected[i].sort().join());
  console.assert(arraysAreEqual, `Test case ${index + 1} failed with output ${result}`);
  console.log(`Test case ${index + 1}`, JSON.stringify(expected) === JSON.stringify(result) ? 'passed' : 'failed');
});