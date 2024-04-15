def twoSum(nums, target):
    # Your code goes here
    return [0,1]


import json
testResults = {}

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected, index):
        result = twoSum(input["nums"], input["target"])
        testResults[f'testCase{index}'] = { "userOutput": result, "expected": expected, "assert": result == expected }

    def run_all_tests():
        test_suite = SolutionTest()
        test_cases = [
            {'input': {"nums": [2,7,11,15], "target": 9}, 'expected': [0,1]},
            {'input': {"nums": [3,2,4], "target": 6}, 'expected': [1,2]},
            {'input': {"nums": [3,3], "target": 6}, 'expected': [0,1]}
        ]

        for i, test_case in enumerate(test_cases, start=1):
            input, expected = test_case['input'], test_case['expected']
            test_suite.run_test_case(input, expected, i)

        return json.dumps(testResults)

test_output = SolutionTest.run_all_tests()
print(test_output)
