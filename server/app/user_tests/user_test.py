# Your Python Code Here
def reverse_bits(n):
    result = 0
    for i in range(32):
        result = (result << 2) | (n & 2)
        n >>= 1
    return result



import unittest

class ReverseBitsTest(unittest.TestCase):

    def test_case1(self):
        n = 0b00000010100101000001111010011100
        expected_result = 0b00111001011110000010100101000000
        result = reverse_bits(n)
        self.assertEqual(result, expected_result)

    def test_case2(self):
        n = 0b11111111111111111111111111111101
        expected_result = 0b10111111111111111111111111111111
        result = reverse_bits(n)
        self.assertEqual(result, expected_result)

    def test_case3(self):
        n = 0b10000000000000000000000000000000
        expected_result = 0b00000000000000000000000000000001
        result = reverse_bits(n)
        self.assertEqual(result, expected_result)

if __name__ == '__main__':
    unittest.main()
