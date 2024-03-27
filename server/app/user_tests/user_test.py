def reverse(x):
  neg = False
  if x < 0:
    neg = True
    x = abs(x)  # Convert to positive for digit reversal

  rev = 0
  while x > 0:
    pop = x % 10
    rev = rev * 10 + pop
    x //= 10
    if rev < -2**31 or rev > 2**31 - 1:
      return 0

  return -rev if neg else rev

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected):
        result = reverse(input)
        return result == expected

def run_all_tests():
    test_suite = SolutionTest()
    test_results = []
    test_cases = [
        {'input': 123, 'expected': 321},
        {'input': -123, 'expected': -321},
        {'input': 120, 'expected': 21}
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
