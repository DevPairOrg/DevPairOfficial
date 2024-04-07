def findMedianSortedArrays(nums1, nums2):
    # Your code goes here
    pass

class SolutionTest:
    @staticmethod
    def run_test_case(input, expected):
        result = findMedianSortedArrays(input["nums1"], input["nums2"])
        return result == expected

def run_all_tests():
    test_suite = SolutionTest()
    test_results = []
    test_cases = [
        {'input': {"nums1": [1, 3], "nums2": [2]}, 'expected': 2.00000},
        {'input': {"nums1": [1, 2], "nums2": [3, 4]}, 'expected': 2.50000},
        {'input': {"nums1": [0, 0], "nums2": [0, 0]}, 'expected': 0.00000}
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
