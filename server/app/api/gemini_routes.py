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

    # WORKING PROMPT WITH CONSISTENT STRUCTURE - TESTING ONE MORE (ABOVE PROMPT)
    convo.send_message(
        """
            When requesting solutions and tests for coding problems, please adhere to the following structured format:

            IMPORTANT: EXPLICITLY DO NOT DO THE FOLLOWING a-b
                a. DO NOT INCLUDE ANY SORT OF MARKDOWN FOR THE RESPONSE SUCH AS MAKING THINGS (i.e. **BOLD**)
                b. DO NOT INCLUDE THREE BACKTICKS AT THE BEGINNING OF THE PYTHON/JAVASCRIPT UNIT TEST AND TO THE END OF IT TO INDICATE A BLOCK OF CODE
                c. DO NOT INCLUDE QUOTATATIONS AROUND THE QUESTION PROMPT
                d. DO NOT INCLUDE THE FOLLOWING ANYWHERE IN THE RESPONSE: ```javascript OR ```python

            1. Provide a clear and concise coding question prompt, including any specific constraints or important details. The question should ideally reflect typical coding challenges or algorithmic problems, preferrably from leetcode.

            2. Provide empty functions with a name relevant to the problem for the user to have ready and within that function include the comments that 'your code goes here'.
                - There should be a python function and a javascript function.
                    - If it's a python function, add the keyword 'pass' instead of a return
                    - If it's a javascript function, keep it empty with just the comment and do not use an arrow function. Also, do not use python comment syntax for javascript such as the three quotations.

            3. List exactly three test cases for the problem. For each test case, include:
            - INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas. If there is a target, explicitly state that as a target. For example, in 'twoSum' problem it intakes parameters of nums=[], target=#
            - OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration.

            4. For Python, create a unit test class using the `unittest` framework. This class should:
            - Include a method for each test case, descriptively named to reflect the test's intent.
            - Use assertions to compare the solution's output to the expected output.
            - Conclude with the standard boilerplate allowing direct execution of the tests.

            5. For JavaScript, outline a simple testing setup using console assertions. This setup should:
            - Define test cases as an array of objects, each with input and expected output.
            - Iterate over test cases, executing the solution function with each input and using `console.assert` to compare the result to the expected output.
            - If the result should be a boolean, make sure its lowercase 'true' or 'false'
            - Make sure to be consistent with the input, if the input is an array, do not spread the values into the function parameter, instead keep it as an array.
            - When developing solutions that involve functions returning arrays, it's crucial to ensure that the unit tests accurately verify the results. The output of these functions often needs to be compared with an expected array of values, which requires more than a simple reference equality check. This document provides guidelines on how to set up unit tests for these scenarios, particularly focusing on JavaScript.
                - Since arrays are compared by reference in JavaScript, directly comparing two arrays with === will not suffice for checking equality of their contents.
                - Implement a method to compare arrays by value and order. This involves iterating over each element of the arrays and comparing them individually. Ensure that the lengths of both arrays are also equal as part of the comparison.
                - Assertion Example if the problem's output is an array:
                    testCases.forEach(({input, expected}, index) => {
                        const result = nameOfFunction(input.value1, input.value2);
                        const arraysAreEqual = result.length === expected.length && result.every((value, i) => value === expected[i]);
                        console.assert(arraysAreEqual, `Test case ${index + 1} failed with output ${result}`);
                        console.log(`Test case ${index + 1}`, JSON.stringify(expected) === JSON.stringify(result) ? 'passed' : 'failed');
                    });

            Ensure both testing sections are correctly formatted for their respective languages.

            EXAMPLES OF MARKDOWNS TO NOT INCLUDE:
            **JAVASCRIPT UNIT TESTING:**
            ```javascript
            ```python

            CORRECT & PROPER EXAMPLE:

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

            testCases.forEach(({input, expected}, index) => {
                const result = nameOfFunction(input);
                console.assert(nameOfFunction(input) === expected, `Test case ${index + 1} failed`);
                console.log(`Test case ${index + 1}`, expected === result);
            });
        """
    )

    # OLD PROMPT
    # convo.send_message(
    #     """
    #         Please provide the following information EXACTLY HOW I AM OUTLINING:
    #         -NO ASTERISKS. ONLY MY SPECIFIC FORMATTING.
    #         # -A random LeetCode Coding Question Prompt with a TITLE (DO NOT GIVE ME THE SAME PROBLEM IF I ASKED PREVIOUSLY)
    #         -THREE Test Cases (input and output pairs)
    #         -Create a unit test for the test cases against the user's solution.
    #         You MUST ensure the response structure is EXACTLY HOW I AM OUTLINING. Thank you!
    #         YOUR RESPONSE EXAMPLE STRUCTURE:
    #         QUESTION PROMPT:
    #         (insert full LeetCode question prompt here)
    #         TEST CASES:
    #         (EXAMPLE STRUCTURE MUST FOLLOW:
    #         - INPUT: (input goes here here. must be comma separated if more than one parameter exists)
    #         - OUTPUT: (output value goes here. NO EXPLANATION!)
    #         )
    #         UNIT TESTING:
    #         (Create a unit test for the test cases against the user's solution that will return a boolean)
    #     """
    # )
    print(convo.last.text)
    return {'geminiResponse': convo.last.text}
