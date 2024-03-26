from flask import Blueprint
from ..gemini import initGlobalGeminiConvo

gemini_routes = Blueprint('gemini', __name__)


# initialize gemini chatbot
convo = initGlobalGeminiConvo()


# TEST ROUTE
@gemini_routes.route('/')
def getRandLeetCodeResponse():
    """
    Generate Random LeetCode Prompt Response
    """
    print('🙃🙃🙃 Currently generating a problem...')

    # PROMPT WIP
    convo.send_message(
        """
            IMPORTANT: Please adhere to the following structure when requesting solutions and tests for coding problems.

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)

            1. Coding Question Prompt:
            Pull a random question prompt strictly from leetcode.
            Do not pull the same question prompt that was generated prior.
            Do not assign types to the function parameters. Use just variable names.

            2. Empty Functions:
            Provide empty functions with names relevant to the problem.
            Include comments within the functions stating "Your code goes here."
            Include two separate functions -- one for python and one for javascript.
            Python: Use pass instead of a return statement within the empty function.
            JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes).
            Parameters for both functions should not have a type assigned to them.

            3. Test Cases:
            List a maximum amount of three test cases that are given from leetcode.
            For each test case, include:
            INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas. If there's a target, explicitly state it (e.g., "target=#").
            OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt.

            4. Python Unit Testing:
            Create a unit test class using the unittest framework.
            Include a method for each test case, descriptively named to reflect the test's intent.
            Use assertions to compare the solution's output to the expected output.
            Conclude with the standard boilerplate allowing direct execution of the tests.

            5. JavaScript Unit Testing:
            Define test cases as an array of objects, each with input and expected output.
            Iterate over test cases, executing the solution function with each input and using console.assert to compare the result to the expected output.
            Make sure to be consistent with input formatting (e.g., keep arrays as arrays, don't spread them).

            For solutions returning arrays:
            Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.
            Use this method within console.assert to verify the expected array structure and content.

            Remember:
            Avoid using any markdown formatting like asterisks for bold text or backticks for code blocks.
            Maintain proper formatting for test case inputs and outputs.

            Your response should be this in this structure very concisely.

            QUESTION PROMPT:
            "Describe the coding problem here, including constraints or relevant details."

            EMPTY FUNCTION:
            def nameOfFunction(input parameters):
                # Your code goes here
                pass

            function nameOfFunction(input parameters) {
                // Your code goes here
            }

            TEST CASES:
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]

            PYTHON UNIT TESTING:
            import unittest

            class SolutionTest(unittest.TestCase):
                def test_case_1(self):
                    # Test case 1 logic here
                    self.assertEqual(actual_result, expected_result)

                def test_case_2(self):
                    # Test case 2 logic here
                    self.assertEqual(actual_result, expected_result)

                def test_case_3(self):
                    # Test case 3 logic here
                    self.assertEqual(actual_result, expected_result)

            if __name__ == '__main__':
                unittest.main()

            JAVASCRIPT UNIT TESTING:
            const testCases = [
                {input: [First input], expected: [Expected output]},
                {input: [Second input], expected: [Expected output]},
                {input: [Third input], expected: [Expected output]}
            ];

            (do not include this line: before producing these test cases with inputs and outputs, make sure you test them beforehand with your database or leetcode test cases to ensure that they the inputs give the correct expected output)
            const testCases = [
                { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
                { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
                { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
            ];

            (do not include this line: this test function below is explicitly an example for array comparisons for test cases. otherwise use a standard test case. if dealing with subarrays, implement a proper method for comparing the the subarray results to the expected results)
            testCases.forEach(({ input, expected }, index) => {
                const result = nameOfFunction(input.nums, input.target);
                console.assert(arraysEqual(result, expected), `Test case ${index + 1} failed`);
                console.log(`Test case ${index + 1}`, JSON.stringify(expected) === JSON.stringify(result));
            });

            function arraysEqual(a, b) {
                return a.length === b.length && a.every((value, index) => value === b[index]);
            }
        """
    )

    # WORKING PROMPT WITH CONSISTENT STRUCTURE - TESTING ONE MORE (ABOVE PROMPT)
    # convo.send_message(
    #     """
    #         When requesting solutions and tests for coding problems, please adhere to the following structured format:

    #         IMPORTANT: EXPLICITLY DO NOT DO THE FOLLOWING a-b
    #             a. DO NOT INCLUDE ANY SORT OF MARKDOWN FOR THE RESPONSE SUCH AS MAKING THINGS (i.e. **BOLD**)
    #             b. DO NOT INCLUDE THREE BACKTICKS AT THE BEGINNING OF THE PYTHON/JAVASCRIPT UNIT TEST AND TO THE END OF IT TO INDICATE A BLOCK OF CODE
    #             c. DO NOT INCLUDE QUOTATATIONS AROUND THE QUESTION PROMPT
    #             d. DO NOT INCLUDE THE FOLLOWING ANYWHERE IN THE RESPONSE: ```javascript OR ```python

    #         1. Provide a clear and concise coding question prompt, including any specific constraints or important details. The question should ideally reflect typical coding challenges or algorithmic problems, preferrably from leetcode. The parameters should not be assigned a type, it should just be a variable name.

    #         2. Provide empty functions with a name relevant to the problem for the user to have ready and within that function include the comments that 'your code goes here'.
    #             - There should be a python function and a javascript function.
    #                 - If it's a python function, add the keyword 'pass' instead of a return
    #                 - If it's a javascript function, keep it empty with just the comment and do not use an arrow function. Also, do not use python comment syntax for javascript such as the three quotations.

    #         3. List exactly three test cases for the problem. For each test case, include:
    #         - INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas. If there is a target, explicitly state that as a target. For example, in 'twoSum' problem it intakes parameters of nums=[], target=#
    #         - OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt.

    #         4. For Python, create a unit test class using the `unittest` framework. This class should:
    #         - Include a method for each test case, descriptively named to reflect the test's intent.
    #         - Use assertions to compare the solution's output to the expected output.
    #         - Conclude with the standard boilerplate allowing direct execution of the tests.

    #         5. For JavaScript, outline a simple testing setup using console assertions. This setup should:
    #         - Define test cases as an array of objects, each with input and expected output.
    #         - Iterate over test cases, executing the solution function with each input and using `console.assert` to compare the result to the expected output.
    #         - If the result should be a boolean, make sure its lowercase 'true' or 'false'
    #         - Make sure to be consistent with the input, if the input is an array, do not spread the values into the function parameter, instead keep it as an array.
    #         - When developing solutions that involve functions returning arrays, it's crucial to ensure that the unit tests accurately verify the results. The output of these functions often needs to be compared with an expected array of values, which requires more than a simple reference equality check. This document provides guidelines on how to set up unit tests for these scenarios, particularly focusing on JavaScript.
    #         - Since arrays are compared by reference in JavaScript, directly comparing two arrays with === will not suffice for checking equality of their contents.
    #         - Implement a method to compare arrays by value and order. This involves iterating over each element of the arrays and comparing them individually. Ensure that the lengths of both arrays are also equal as part of the comparison.
    #         - Assertion Example if the problem's output is an array:
    #             testCases.forEach(({input, expected}, index) => {
    #                 const result = nameOfFunction(input.value1, input.value2);
    #                 const arraysEqual = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
    #                 console.assert(arraysEqual(result, expected), `Test case ${index + 1} failed. Expected ${expected} but got ${result}`);
    #                 console.log(`Test case ${index + 1}`, JSON.stringify(expected) === JSON.stringify(result));
    #             });

    #         Ensure both testing sections are correctly formatted for their respective languages.

    #         EXAMPLES OF MARKDOWNS TO NOT INCLUDE:
    #         **JAVASCRIPT UNIT TESTING:**
    #         ```javascript
    #         ```python

    #         CORRECT & PROPER EXAMPLE:

    #         QUESTION PROMPT:
    #         "Describe the coding problem here, including constraints or relevant details."

    #         EMPTY FUNCTION:
    #         def nameOfFunction(input parameters):
    #             # Your code goes here
    #             pass

    #         function nameOfFunction(input parameters) {
    #             // Your code goes here
    #         }

    #         TEST CASES:
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]
    #         - INPUT: [First input], [Second input if necessary]
    #         - OUTPUT: [Expected output]

    #         PYTHON UNIT TESTING:

    #         import unittest

    #         class SolutionTest(unittest.TestCase):
    #             def test_case_1(self):
    #                 # Test case 1 logic here
    #                 self.assertEqual(actual_result, expected_result)

    #             def test_case_2(self):
    #                 # Test case 2 logic here
    #                 self.assertEqual(actual_result, expected_result)

    #             def test_case_3(self):
    #                 # Test case 3 logic here
    #                 self.assertEqual(actual_result, expected_result)

    #         if __name__ == '__main__':
    #             unittest.main()

    #         JAVASCRIPT UNIT TESTING:
    #         const testCases = [
    #             {input: [First input], expected: [Expected output]},
    #             {input: [Second input], expected: [Expected output]},
    #             {input: [Third input], expected: [Expected output]}
    #         ];

    #         testCases.forEach(({input, expected}, index) => {
    #             const result = nameOfFunction(input);
    #             console.assert(nameOfFunction(input) === expected, `Test case ${index + 1} failed`);
    #             console.log(`Test case ${index + 1}`, expected === result);
    #         });
    #     """
    # )

    print(convo.last.text)
    return {'geminiResponse': convo.last.text}
