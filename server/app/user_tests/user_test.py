def removeDuplicates(array):
    # Your code goes here
    return 3


import json
testResults = {}

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected, index):
        result = solution(input)
        testResults[f'testCase{index}'] = { "userOutput": result, "expected": expected, "assert": result == expected }

    def run_all_tests():
        test_suite = SolutionTest()
        test_cases = [
            {'input': [1,1,2], 'expected': 2},
            {'input': [0,0,1,1,1,2,2,3,3,4], 'expected': 5},
            {'input': [1,2,3], 'expected': 3}
        ]

        for i, test_case in enumerate(test_cases, start=1):
            input, expected = test_case['input'], test_case['expected']
            test_suite.run_test_case(input, expected, i)

        return json.dumps(testResults)

test_output = SolutionTest.run_all_tests()
print(test_output)
