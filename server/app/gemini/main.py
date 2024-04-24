"""
At the command line, only need to run once to install the package via pip:

$ pip install google-generativeai
"""

import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()


def initGlobalGeminiConvo():
  try:
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key is not None:
      genai.configure(api_key=api_key)
    else:
      print("Error: GEMINI_API_KEY environment variable not set.")
  except NameError:
    print("Error: 'genai' library not found. Please install it.")

  # Set up the model
  generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
  }

  safety_settings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
  ]

  model = genai.GenerativeModel(model_name="gemini-pro",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

  convo = model.start_chat(history=[
    {
      "role": "user",
      "parts": ["For the entire structured response STRICTLY DO NOT include any markdowns such as:\n (i.e. **BOLD**)            (i.e. ```javascript)            (i.e. ```python)                \n Context: You are expected to generate a data structure and algorithm practice problem of easy or medium difficulty. Do not generate any problems with linked lists or binary trees. If 'user_solved_problems: <example comma separated list>' specified, do not generate any problems in this list as the user has already successfully solved these. The problem should simulate a real-world scenario and include a comprehensive description and detailed constraints. Only return the following keys: 'PROBLEM NAME', 'CONSTRAINTS', 'DIFFICULTY', and 'QUESTION PROMPT' and in JSON so I can parse with json.loads in python."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PROBLEM NAME\": \"Sherlock and Watson's Function\",\n  \"CONSTRAINTS\": \"1 <= n, k <= 10^6\\n1 <= l <= r <= n\",\n  \"DIFFICULTY\": \"EASY\",\n  \"QUESTION PROMPT\": \"Sherlock and Watson are playing a game with integers. They have an array of n integers, a1, a2, ..., an, and a value k. The game consists of the following steps:\\n\\n1. Sherlock chooses a contiguous subarray of the array, denoted by l and r (1 <= l <= r <= n).\n2. Watson calculates the sum of the elements in the chosen subarray, denoted by s.\n3. Sherlock then adds the value k to s.\n4. If the resulting sum s is divisible by k, Sherlock wins the game; otherwise, Watson wins the game.\\n\\nDetermine the winner of the game.\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide empty functions for the problem you generated. The functions should be named according to the problem and include comments within the functions stating \"Your code goes here.\" Include two separate functions -- one for python and one for javascript. Python: Use pass instead of a return statement within the empty function. JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes). Parameters for both functions should not have a type assigned to them. Respond in JSON so I can parse with json.loads in python.          DO NOT ADD TYPES TO THE FUNCTION PARAMETERS Use # for comments in python and // for comments in javascript"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON FUNCTION SIGNATURE\": \"def sherlock_and_watson_function(arr, k):\\n  #Your code goes here.\n   pass\",\n  \"JAVASCRIPT FUNCTION SIGNATURE\": \"function sherlockAndWatsonFunction(arr, k) {\\n  // Your code goes here.\\n}\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide test cases for the problem you generated. Define at least three test cases as an array of objects, each with input and expected output.            For each test case, include:            --INPUT: The inputs needed to test the solution, with multiple parameters separated by SEMICOLONS and the parameter set to the variable it corresponds to in the function signature. (e.g., \"nums=[1,2,3]; target=3\"). DO NOT SEPARATE INPUT PARAMETERS WITH COMMAS USE SEMICOLONS.            --OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt. Respond in JSON so I can parse with json.loads in python. Keep in mind that the test cases should be consistent with the problem description and constraints and array indexes are zero based."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"TEST CASES\": [\n    {\n      \"INPUT\": \"arr=[1, 2, 3, 4, 5]; k=2\",\n      \"OUTPUT\": \"Watson\"\n    },\n    {\n      \"INPUT\": \"arr=[1, 1, 1, 1, 1]; k=2\",\n      \"OUTPUT\": \"Sherlock\"\n    },\n    {\n      \"INPUT\": \"arr=[1, 2, 3, 4, 5]; k=3\",\n      \"OUTPUT\": \"Sherlock\"\n    }\n  ]\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide unit tests for the problem you generated. Define unit test for both Python and JavaScript. For each language, define a test suite that includes a method to run a single test case and a method to run all test cases. The test suite should iterate over the test cases, executing the solution function with each input and using an expression to compare the result to the expected output. Make sure to be consistent with input formatting (e.g., keep arrays as arrays, don't spread them). Follow the example response format provided.            Define test cases as an list of objects, each with input and expected output (these keys should be inside quotations).                        Iterate over test cases, executing the solution function with each input and using expression to compare the result to the expected output in order to return a boolean.            Make sure to be consistent with input formatting (e.g., keep lists as lists, don't spread them).            For solutions returning arrays:            Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.            Use this method within console.assert to verify the expected array structure and content.            Remember:            Maintain proper formatting for test case inputs and outputs. Respond in JSON so I can parse with json.loads in python."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON_UNIT_TEST\": \"import unittest\\n\\nclass SherlockAndWatsonFunctionTests(unittest.TestCase):\\n\\n    def test_case_1(self):\\n        input_arr = [1, 2, 3, 4, 5]\\n        input_k = 2\\n        expected_output = \\\"Watson\\\"\\n        result = sherlock_and_watson_function(input_arr, input_k)\\n        self.assertEqual(result, expected_output)\\n\\n    def test_case_2(self):\\n        input_arr = [1, 1, 1, 1, 1]\\n        input_k = 2\\n        expected_output = \\\"Sherlock\\\"\\n        result = sherlock_and_watson_function(input_arr, input_k)\\n        self.assertEqual(result, expected_output)\\n\\n    def test_case_3(self):\\n        input_arr = [1, 2, 3, 4, 5]\\n        input_k = 3\\n        expected_output = \\\"Sherlock\\\"\\n        result = sherlock_and_watson_function(input_arr, input_k)\\n        self.assertEqual(result, expected_output)\\n\\n    def run_all_tests(self):\\n        unittest.main()\\n\\nif __name__ == '__main__':\\n    SherlockAndWatsonFunctionTests.run_all_tests()\",\n  \"JAVASCRIPT_UNIT_TEST\": \"const assert = require('assert');\\n\\ndescribe('Sherlock and Watson Function Tests', () => {\\n  it('Test Case 1', () => {\\n    const inputArr = [1, 2, 3, 4, 5];\\n    const inputK = 2;\\n    const expectedOutput = \\\"Watson\\\";\\n    assert.strictEqual(sherlockAndWatsonFunction(inputArr, inputK), expectedOutput);\\n  });\\n\\n  it('Test Case 2', () => {\\n    const inputArr = [1, 1, 1, 1, 1];\\n    const inputK = 2;\\n    const expectedOutput = \\\"Sherlock\\\";\\n    assert.strictEqual(sherlockAndWatsonFunction(inputArr, inputK), expectedOutput);\\n  });\\n\\n  it('Test Case 3', () => {\\n    const inputArr = [1, 2, 3, 4, 5];\\n    const inputK = 3;\\n    const expectedOutput = \\\"Sherlock\\\";\\n    assert.strictEqual(sherlockAndWatsonFunction(inputArr, inputK), expectedOutput);\\n  });\\n});\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["For the entire structured response STRICTLY DO NOT include any markdowns such as:\n (i.e. **BOLD**)            (i.e. ```javascript)            (i.e. ```python)                \n Context: You are expected to generate a data structure and algorithm practice problem of easy or medium difficulty. Do not generate any problems with linked lists or binary trees. If 'user_solved_problems: <example comma separated list>' specified, do not generate any problems in this list as the user has already successfully solved these. The problem should simulate a real-world scenario and include a comprehensive description and detailed constraints. Only return the following keys: 'PROBLEM NAME', 'CONSTRAINTS', 'DIFFICULTY', and 'QUESTION PROMPT' and in JSON so I can parse with json.loads in python.\n\nuser_solved_problems: Top K Frequent Elements, Valid Anagram, Reverse Linked List II , Search in Rotated Sorted Array, Word Ladder"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PROBLEM NAME\": \"Closest Pair of Points\",\n  \"CONSTRAINTS\": \"2 <= n <= 10^5\\n-10^9 <= x_i, y_i <= 10^9\",\n  \"DIFFICULTY\": \"MEDIUM\",\n  \"QUESTION PROMPT\": \"Given an array of n points in the plane, where each point is represented by its x and y coordinates, find the pair of points with the smallest Euclidean distance between them. The Euclidean distance between two points (x1, y1) and (x2, y2) is given by the formula: sqrt((x1 - x2)^2 + (y1 - y2)^2).\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide empty functions for the problem you generated. The functions should be named according to the problem and include comments within the functions stating \"Your code goes here.\" Include two separate functions -- one for python and one for javascript. Python: Use pass instead of a return statement within the empty function. JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes). Parameters for both functions should not have a type assigned to them. Respond in JSON so I can parse with json.loads in python.          DO NOT ADD TYPES TO THE FUNCTION PARAMETERS Use # for comments in python and // for comments in javascript"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON FUNCTION SIGNATURE\": \"def closest_pair_of_points(points):\\n  # Your code goes here.\n  pass\",\n  \"JAVASCRIPT FUNCTION SIGNATURE\": \"function closestPairOfPoints(points) {\\n  // Your code goes here.\\n}\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide test cases for the problem you generated. Define at least three test cases as an array of objects, each with input and expected output.            For each test case, include:            --INPUT: The inputs needed to test the solution, with multiple parameters separated by SEMICOLONS and the parameter set to the variable it corresponds to in the function signature. (e.g., \"nums=[1,2,3]; target=3\"). DO NOT SEPARATE INPUT PARAMETERS WITH COMMAS USE SEMICOLONS.            --OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt. Respond   in JSON so I can parse with json.loads in python. Keep in mind that the test cases should be consistent with the problem description and constraints and array indexes are zero based."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"TEST CASES\": [\n    {\n      \"INPUT\": \"points=[[1, 1], [2, 2], [3, 3], [4, 4]]\",\n      \"OUTPUT\": \"1.0\"\n    },\n    {\n      \"INPUT\": \"points=[[1, 1], [1, 2], [1, 3], [1, 4]]\",\n      \"OUTPUT\": \"0.0\"\n    },\n    {\n      \"INPUT\": \"points=[[1, 1], [2, 3], [3, 2], [4, 4]]\",\n      \"OUTPUT\": \"2.8284271247461903\"\n    }\n  ]\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide unit tests for the problem you generated. Define unit test for both Python and JavaScript. For each language, define a test suite that includes a method to run a single test case and a method to run all test cases. The test suite should iterate over the test cases, executing the solution function with each input and using an expression to compare the result to the expected output. Make sure to be consistent with input formatting (e.g., keep arrays as arrays, don't spread them). Follow the example response format provided.            Define test cases as an list of objects, each with input and expected output (these keys should be inside quotations).                        Iterate over test cases, executing the solution function with each input and using expression to compare the result to the expected output in order to return a boolean.            Make sure to be consistent with input formatting (e.g., keep lists as lists, don't spread them).            For solutions returning arrays:            Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.            Use this method within console.assert to verify the expected array structure and content.            Remember:            Maintain proper formatting for test case inputs and outputs. Respond in JSON so I can parse with json.loads in python."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON_UNIT_TEST\": \"import unittest\\n\\nclass ClosestPairOfPointsTests(unittest.TestCase):\\n\\n    def test_case_1(self):\\n        input_points = [[1, 1], [2, 2], [3, 3], [4, 4]]\\n        expected_output = 1.0\\n        result = closest_pair_of_points(input_points)\\n        self.assertAlmostEqual(result, expected_output)\\n\\n    def test_case_2(self):\\n        input_points = [[1, 1], [1, 2], [1, 3], [1, 4]]\\n        expected_output = 0.0\\n        result = closest_pair_of_points(input_points)\\n        self.assertAlmostEqual(result, expected_output)\\n\\n    def test_case_3(self):\\n        input_points = [[1, 1], [2, 3], [3, 2], [4, 4]]\\n        expected_output = 2.8284271247461903\\n        result = closest_pair_of_points(input_points)\\n        self.assertAlmostEqual(result, expected_output)\\n\\n    def run_all_tests(self):\\n        unittest.main()\\n\\nif __name__ == '__main__':\\n    ClosestPairOfPointsTests.run_all_tests()\",\n  \"JAVASCRIPT_UNIT_TEST\": \"const assert = require('assert');\\n\\ndescribe('Closest Pair of Points Tests', () => {\\n  it('Test Case 1', () => {\\n    const inputPoints = [[1, 1], [2, 2], [3, 3], [4, 4]];\\n    const expectedOutput = 1.0;\\n    assert.strictEqual(closestPairOfPoints(inputPoints), expectedOutput);\\n  });\\n\\n  it('Test Case 2', () => {\\n    const inputPoints = [[1, 1], [1, 2], [1, 3], [1, 4]];\\n    const expectedOutput = 0.0;\\n    assert.strictEqual(closestPairOfPoints(inputPoints), expectedOutput);\\n  });\\n\\n  it('Test Case 3', () => {\\n    const inputPoints = [[1, 1], [2, 3], [3, 2], [4, 4]];\\n    const expectedOutput = 2.8284271247461903;\\n    assert.strictEqual(closestPairOfPoints(inputPoints), expectedOutput);\\n  });\\n});\"\n}\n```"]
    },
  ])

  # convo.send_message("Generate a unique leetcode problem that is not on leetcode and give us three test cases. Also give me the full solution with the function to test each individual case with my IDE")
  # print(convo.last.text)

  return convo
