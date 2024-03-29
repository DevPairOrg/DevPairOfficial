def binary_search(nums, target):
    # Your code goes here
    testing

class SolutionTest:
@staticmethod
def run_test_case(nums, target, expected):
result = binary_search(nums, target)
return result == expected

def run_all_tests():
test_suite = SolutionTest()
test_results = []
test_cases = [
{'input': [-1,0,3,5,9,12], 'target': 9, 'expected': 4},
{'input': [-1,0,3,5,9,12], 'target': 2, 'expected': 3},
{'input': [2,5], 'target': 4, 'expected': 1}
]
for i, test_case in enumerate(test_cases, start=1):
nums, target, expected = test_case['input'], test_case['target'], test_case['expected']
result = test_suite.run_test_case(nums, target, expected)
test_results.append((f"Test case {i}", result))
return test_results

if __name__ == '__main__':
results = run_all_tests()
for test_case, result in results:
print(f"{test_case}: {True if result else False}")
