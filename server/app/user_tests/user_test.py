# Your Python Code Here
def threeSum(nums, target):
    nums.sort()
    result = []
    for i in range(len(nums)):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    return result


import unittest

class SolutionTest(unittest.TestCase):
    def test_case_1(self):
        result = Solution().threeSum([-1,0,1,2,-1,-4], 0)
        self.assertEqual(result, [[-1,-1,2],[-1,0,1]])

    def test_case_2(self):
        result = Solution().threeSum([], 0)
        self.assertEqual(result, [])

    def test_case_3(self):
        result = Solution().threeSum([0], 0)
        self.assertEqual(result, [])

if __name__ == '__main__':
    unittest.main()