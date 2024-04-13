def findPeakElement(nums):
    return 5

testResults = {}

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected, index):
        result = findPeakElement(input)
        testResults[f'testResults{index}'] = { "userOutput": result, "expected": expected, "assert": result == expected }

    def run_all_tests():
        test_suite = SolutionTest()
        test_cases = [
            {'input': [1,2,3,1], 'expected': 2},
            {'input': [1,2,1,3,5,6,4], 'expected': 5},
            {'input': [1,2,3], 'expected': 2}
        ]

        for i, test_case in enumerate(test_cases, start=1):
            input, expected = test_case['input'], test_case['expected']
            test_suite.run_test_case(input, expected, i)

        return testResults

testResults = SolutionTest.run_all_tests()

print(f'{testResults["testResults1"]["userOutput"]} NEXT ELEMENT {testResults["testResults1"]["expected"]} NEXT ELEMENT {testResults["testResults1"]["assert"]} NEXT ELEMENT {testResults["testResults2"]["userOutput"]} NEXT ELEMENT {testResults["testResults2"]["expected"]} NEXT ELEMENT {testResults["testResults2"]["assert"]} NEXT ELEMENT {testResults["testResults3"]["userOutput"]} NEXT ELEMENT {testResults["testResults3"]["expected"]} NEXT ELEMENT {testResults["testResults3"]["assert"]}')
