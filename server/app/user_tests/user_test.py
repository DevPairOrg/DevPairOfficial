def uniquePaths(m: int, n: int):
    # Your code goes here
    pass

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected):
        result = uniquePaths(input[0], input[1])
        return result == expected

def run_all_tests():
    test_suite = SolutionTest()
    test_results = []
    test_cases = [
        {'input': [3, 7], 'expected': 28},
        {'input': [3, 2], 'expected': 3},
        {'input': [7, 3], 'expected': 28}
    ]
    for i, test_case in enumerate(test_cases, start=1):
        input, expected = test_case['input'], test_case['expected']
        result = test_suite.run_test_case(input, expected)
        test_results.append((f"Test case {i}", result))
    return test_results

if __name__ == '__main__':
    results = run_all_tests()
    for test_case, result in results:
        print(f"{test_case}: {True if result else False}")
