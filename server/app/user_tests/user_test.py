def addTwoNumbers(l1, l2):
  print("ASDASDASDGGGG")
  return "ASDASDASDASDTTT"


import json
testResults = {}

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected, index):
        result = addTwoNumbers(input[0], input[1])
        testResults[f'testCase{index}'] = { "userOutput": result, "expected": expected, "assert": result == expected }

    def run_all_tests():
        test_suite = SolutionTest()
        test_cases = [
            {'input': [[2,4,3], [5,6,4]], 'expected': [7,0,8]},
            {'input': [[0], [0]], 'expected': [0]},
            {'input': [[9,9,9,9,9,9,9], [9,9,9,9]], 'expected': [1,0,0,0,0,0,0,0]}
        ]

        for i, test_case in enumerate(test_cases, start=1):
            input, expected = test_case['input'], test_case['expected']
            test_suite.run_test_case(input, expected, i)

        return json.dumps(testResults)

test_output = SolutionTest.run_all_tests()
print(test_output)
