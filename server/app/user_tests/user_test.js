// Your JavaScript Code Here
const twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] + nums[j] === target) return [i, j]
    }
  }
};
import unittest

class SearchInsertPositionTest(unittest.TestCase):

    def test_case_1(self):
        nums = [-1,0,3,5,9,12]
        target = 9
        expected = 4
        result = search_insert(nums, target)
        self.assertEqual(result, expected)

    def test_case_2(self):
        nums = [-1,0,3,5,9,12]
        target = 2
        expected = -1
        result = search_insert(nums, target)
        self.assertEqual(result, expected)

    def test_case_3(self):
        nums = [5]
        target = 5
        expected = 0
        result = search_insert(nums, target)
        self.assertEqual(result, expected)
