def twoSum(nums, target):
    # Your code goes here
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] =



```python
import unittest

class SolutionTest(unittest.TestCase):
    def test_case_1(self):
        input = [2,7,11,15], 9
        expected = [0,1]
        self.assertEqual(twoSum(*input), expected)
    
    def test_case_2(self):
        input = [3,2,4], 6
        expected = [1,2]
        self.assertEqual(twoSum(*input), expected)

    def test_case_3(self):
        input = [3,3], 6
        expected = [0,1]
        self.assertEqual(twoSum(*input), expected)

if __name__ == "__main__":
    unittest.main()
```