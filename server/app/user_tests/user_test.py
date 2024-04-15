def maxSubArray(nums):
    # Your code goes here
    var = 5
    return "ASDASDSGG"


import json
testResults = {}

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected, index):
        result = maxSubArray(input)
        testResults[f'testCase{index}'] = { "userOutput": result, "expected": expected, "assert": result == expected }

    def run_all_tests():
        test_suite = SolutionTest()
        test_cases = [
            {'input': [-2,1,-3,4,-1,2,1,-5,4], 'expected': 6},
            {'input': [1], 'expected': 1},
            {'input': [5,4,-1,7,8], 'expected': 23}
        ]

        for i, test_case in enumerate(test_cases, start=1):
            input, expected = test_case['input'], test_case['expected']
            test_suite.run_test_case(input, expected, i)

        return json.dumps(testResults)

test_output = SolutionTest.run_all_tests()
print(test_output)
