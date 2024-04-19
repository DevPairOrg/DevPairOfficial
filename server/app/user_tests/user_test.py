def reverseWords(s: str) -> str:
    # Your code goes here 
  return  ' '.join(input_string.split()[::-1])

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected):
        result = reverseWords(input)
        return result == expected

def run_all_tests():
    test_suite = SolutionTest()
    test_results = []
    test_cases = [
        {'input': "the sky is blue", 'expected': "blue is sky the"},
        {'input': "  hello world  ", 'expected': "world hello"},
        {'input': "a good   example", 'expected': "example good a"}
    ]
    for i, test_case in enumerate(test_cases, start=1):
        input, expected = test_case['input'], test_case['expected']
        result = test_suite.run_test_case(input, expected)
        test_results.append((f'Test case {i}', result))
    return test_results

if __name__ == '__main__':
    results = run_all_tests()
    for test_case, result in results:
        print(f'{test_case}: {True if result else False}')