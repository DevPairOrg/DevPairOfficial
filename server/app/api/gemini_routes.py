from flask import Blueprint, request
from ..gemini import initGlobalGeminiConvo
from app.models import User, db
import json

gemini_routes = Blueprint('gemini', __name__)

# Initialize chatbot
convo = initGlobalGeminiConvo()


@gemini_routes.route('/add', methods=['POST'])
def addQuestionPromptToUserModel():
    try:
        user_id = request.json.get('userId')
        prompt = request.json.get('prompt')

        if not user_id or not prompt:
            return {"error": "Request body is missing"}, 500

        user = User.query.get(user_id) # grab user from model
        if not user:
            return {"error": "User not found"}, 404

        parsed_question_name = prompt.split('\n')[1] # get question name from gemini response

        user.completed_leetcode_problems += (parsed_question_name + ', ')
        db.session.commit()

        return {'message': f'Successfully added {parsed_question_name} to user {user_id}'}

    except Exception as e:
        print("ERROR --------------->", e)
        return {"error": "Failed to add prompt to user"}, 500



@gemini_routes.route('/generate/<int:id>')
def getLeetCodeResponseBits(id):
    """
    This route breaks down the prompt into small bits for gemini 1.0 to consume and produce accurate responses; also to hopefully prevent recitation errors
    """

    user = User.query.get(id) # grab user from model
    user = user.to_dict()
    prev_solved_questions = user['completedLeetcodeProblems'] # ensure AI does not use a previously solved question from this user

    print('🥱🥱🥱 Generating Problem, please wait.')

    format_response = f"""
        DIFFICULTY: 

        PROBLEM NAME:
                            
        QUESTION PROMPT:
                           
        CONSTRAINTS:
                           
        TEST CASES:
        - INPUT: [First input], [Second input if necessary]            
        - OUTPUT: [Expected output]           
        - INPUT: [First input], [Second input if necessary]           
        - OUTPUT: [Expected output]            
        - INPUT: [First input], [Second input if necessary]            
        - OUTPUT: [Expected output]
                           
        PYTHON FUNCTION SIGNATURE:
        ex. def <nameOfFunction>(<input parameters>): 
            # Your code goes here 
            pass
                           
        JAVASCRIPT FUNCTION SIGNATURE:
        ex. function <nameOfFunction>(<input parameters>) {{ 
            // Your code goes here           
        }}
                           
        PYTHON UNIT TESTS:
                           
        JAVASCRIPT UNIT TESTS:"""

    example_response = json.dumps({
    "CONSTRAINTS": "1 <= arr.length <= 10^5\n-10^9 <= arr[i] <= 10^9",
    "DIFFICULTY": "Easy",
    "JAVASCRIPT FUNCTION SIGNATURE": "function checkIfExist(arr: number[]): boolean {",
    "JAVASCRIPT UNIT TESTS": "const assert = require('assert');\ndescribe('checkIfExist', () => {\n  it('test_1', () => {\n      const arr = [10,2,5,3];\n      assert.strictEqual(checkIfExist(arr), true);\n  });\n  it('test_2', () => {\n      const arr = [7,1,14,11];\n      assert.strictEqual(checkIfExist(arr), true);\n  });\n  it('test_3', () => {\n      const arr = [3,1,7,11];\n     assert.strictEqual(checkIfExist(arr), false);\n  });\n});",
    "PROBLEM NAME": "Check If N and Its Double Exist",
    "PYTHON FUNCTION SIGNATURE": "def checkIfExist(arr: List[int]) -> bool:",
    "PYTHON UNIT TESTS": "import unittest\n\nclass checkIfExist(unittest.TestCase):\n\n    def test_1(self):\n        input_array = [10,2,5,3]\n        self.assertEqual(checkIfExist(input_array), True)\n\n    def test_2(self):\n        input_array = [7,1,14,11]\n        self.assertEqual(checkIfExist(input_array), True)\n\n    def test_3(self):\n      input_array = [3,1,7,11]\n      self.assertEqual(checkIfExist(input_array), False)",
    "QUESTION PROMPT": "Given an array arr of integers, check if there exists two indices i and j such that i != j and arr[i] == 2 * arr[j].\n Return true if such indices exists, otherwise return false.",
    "TEST CASES": [
      {
        "INPUT": "[10,2,5,3]\n",
        "OUTPUT": "true"
      },
      {
        "INPUT": "[7,1,14,11]\n",
        "OUTPUT": "true"
      },
      {
        "INPUT": "[3,1,7,11]\n",
        "OUTPUT": "false"
      }
    ]
    })
    

    convo.send_message(f"""
        Context: Generate a LeetCode-style problem of user specified difficulty that involves data structures and algorithms. If specified, do not generate any problems in the list specified by the user indicated with 'user_solved_problems: <example comma separated list>' The problem should simulate a real-world scenario and include a comprehensive description, detailed constraints, and examples. It should also consider edge cases that necessitate careful thought and extensive testing. Provide empty Python and JavaScript function signatures. Include a set of test cases that cover both standard and edge cases. Avoid using markdown formatting such as bold or code blocks in the entire structured response. Follow the response template provided and return json string using the header, ex. PROBLEM NAME: , as the key.
        
        User Input: Generate a random leetcode problem. user_solved_problems: {prev_solved_questions}

        Response Template: {format_response}

        Example Response: {example_response}

        """)

    # convo.send_message(
    #     f"""
    #         IMPORTANT: Please adhere to the following structure when requesting solutions and tests for coding problems.

    #         For the entire structured response STRICTLY DO NOT include any markdowns such as:
    #         (i.e. **BOLD**)
    #         (i.e. ```javascript)
    #         (i.e. ```python)

    #         1. Pull a coding question from leetcode in the following format and do not assign types to the function parameters. Use just variable names:

    #         PROBLEM NAME:
    #         Name of Problem

    #         QUESTION PROMPT:
    #         Describe the coding problem here, including constraints or relevant details.

    #         ***IMPORTANT NOTE*** YOU MAY NOT USE THE FOLLOWING LEETCODE PROBLEMS:
    #         {prev_solved_questions}
    #     """
    # )

    # name_and_prompt = convo.last.text

    # convo.send_message(
    #     f"""
    #         IMPORTANT:
    #         - Please adhere to the following structure when requesting solutions and tests for coding problems.
    #         - Keep it relevant to our conversation, {name_and_prompt}

    #         For the entire structured response STRICTLY DO NOT include any markdowns such as:
    #         (i.e. **BOLD**)
    #         (i.e. ```javascript)
    #         (i.e. ```python)

    #         1. Empty Functions:
    #         Provide empty functions with names relevant to the problem.
    #         Include comments within the functions stating "Your code goes here."
    #         Include two separate functions -- one for python and one for javascript.
    #         Python: Use pass instead of a return statement within the empty function.
    #         JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes).
    #         Parameters for both functions should not have a type assigned to them.

    #         Follow this Example Format:

    #         EMPTY FUNCTION:
    #         def nameOfFunction(input parameters):
    #             # Your code goes here
    #             pass

    #         function nameOfFunction(input parameters) {{
    #             // Your code goes here
    #         }}
    #     """
    # )

    # default_function_names = convo.last.text

    # convo.send_message(
    #     f"""
    #         IMPORTANT:
    #         - Please adhere to the following structure when requesting solutions and tests for coding problems.
    #         - Keep it relevant to our conversation, {name_and_prompt}

    #         For the entire structured response STRICTLY DO NOT include any markdowns such as:
    #         (i.e. **BOLD**)
    #         (i.e. ```javascript)
    #         (i.e. ```python)

    #         1. Test Cases:
    #         List no more than three test cases that are provided on leetcode.
    #         For each test case, include:
    #         INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas. If there's a target, explicitly state it (e.g., "target=#").
    #         OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt.

    #         Follow the follwing example format:
    #         TEST CASES:
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]
    #     """
    # )

    # test_cases = convo.last.text

    # convo.send_message(
    #     f"""
    #         Important: Create a test in python based on the instructions provided below. The tests should all be relevant to the problem {name_and_prompt} response which you gave me in our previous conversation and test specifically for these {test_cases} you gave me.

    #         For the entire structured response STRICTLY DO NOT include any markdowns such as:
    #         (i.e. **BOLD**)
    #         (i.e. ```javascript)
    #         (i.e. ```python)
    #         (i.e. ##)
    #         (i.e. ###)

    #         1. Python Testing:
    #         Do not use unittest
    #         Define test cases as an list of objects, each with input and expected output (these keys should be inside quotations).
    #         Iterate over test cases, executing the solution function with each input and using expression to compare the result to the expected output in order to return a boolean.
    #         Make sure to be consistent with input formatting (e.g., keep lists as lists, don't spread them).

    #         For solutions returning arrays:
    #         Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.
    #         Use this method within console.assert to verify the expected array structure and content.

    #         Remember:
    #         Avoid using any markdown formatting like asterisks for bold text or backticks for code blocks.
    #         Maintain proper formatting for test case inputs and outputs.

    #         Follow the following example format:

    #         PYTHON UNIT TESTING:
    #         class SolutionTest:
    #             @staticmethod
    #             def run_test_case(input, expected):
    #                 result = nameOfFunction(input)
    #                 return result == expected

    #         def run_all_tests():
    #             test_suite = SolutionTest()
    #             test_results = []
    #             test_cases = [
    #                 {{'input': [First input], 'expected': [Expected output]}},
    #                 {{'input': [Second input], 'expected': [Expected output]}},
    #                 {{'input': [Third input], 'expected': [Expected output]}}
    #             ]
    #             for i, test_case in enumerate(test_cases, start=1):
    #                 input, expected = test_case['input'], test_case['expected']
    #                 result = test_suite.run_test_case(input, expected)
    #                 test_results.append((f"Test case {{i}}", result))
    #             return test_results

    #         if __name__ == '__main__':
    #             results = run_all_tests()
    #             for test_case, result in results:
    #                 print(f"{{test_case}}: {{True if result else False}}")
    #     """
    # )

    # python_test = convo.last.text

    # convo.send_message(
    #     f"""
    #         Important: Create a unit test in javascript based on the instructions provided below. The tests should all be relevant to the problem {name_and_prompt} response which you gave me in our previous conversation and test specifically for these {test_cases} you gave me.

    #         For the entire structured response STRICTLY DO NOT include any markdowns such as:
    #         (i.e. **BOLD**)
    #         (i.e. ```javascript)
    #         (i.e. ```python)
    #         (i.e. ##)
    #         (i.e. ###)

    #         1. JavaScript Unit Testing:
    #         Define test cases as an array of objects, each with input and expected output.
    #         Iterate over test cases, executing the solution function with each input and using console.assert to compare the result to the expected output.
    #         Make sure to be consistent with input formatting (e.g., keep arrays as arrays, don't spread them).

    #         For solutions returning arrays:
    #         Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.
    #         Use this method within console.assert to verify the expected array structure and content.

    #         Remember:
    #         Avoid using any markdown formatting like asterisks for bold text or backticks for code blocks.
    #         Maintain proper formatting for test case inputs and outputs.

    #         Follow the following example format:

    #         (do not include this line: these test cases should be pulled from leetcode)
    #         JAVASCRIPT UNIT TESTING:
    #         const testCases = [
    #             {{input: [First input], expected: [Expected output]}},
    #             {{input: [Second input], expected: [Expected output]}},
    #             {{input: [Third input], expected: [Expected output]}}
    #         ];

    #         (do not include this line: this test function below is explicitly an example for array comparisons for test cases. otherwise use a standard test case. if dealing with subarrays, implement a proper method for comparing the the subarray results to the expected results)
    #         testCases.forEach(({{ input, expected }}, index) => {{
    #             const result = nameOfFunction(input.nums, input.target);
    #             console.assert(arraysEqual(result, expected), `Test case ${{index + 1}} failed`);
    #             console.log(`Test case ${{index + 1}}`, JSON.stringify(expected) === JSON.stringify(result));
    #         }});

    #         function arraysEqual(a, b) {{
    #             return a.length === b.length && a.every((value, index) => value === b[index]);
    #         }}
    #     """
    # )

    javascript_test = convo.last.text

    data = json.loads(javascript_test)
    jstr = json.dumps(data)

    # print('😁😁😁 name & prompt', name_and_prompt)
    # print('😁😁😁 default fn names', default_function_names)
    # print('😁😁😁 test cases', test_cases)
    # print('😁😁😁 python tests', python_test)
    print('😁😁😁 javascript tests', jstr)
    return {'geminiResponse': data}
