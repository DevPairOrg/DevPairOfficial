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

    # NEW PROMPT - WIP
#     convo.send_message(
#         """
#             When submitting coding problems for solutions and tests, please follow this structured format carefully to ensure clarity and consistency:

#             Coding Question Prompt: Present the coding problem in a clear and concise manner. Include any necessary constraints or important details. The question should resemble typical challenges found in coding interviews or on platforms like LeetCode.

#             Test Cases: Provide exactly three test cases for the problem. Detail the inputs and the expected output for each case as follows:

#             INPUT: List all inputs required to test the solution. For multiple parameters, separate them with commas.
#             OUTPUT: Give the expected output for the provided inputs, succinctly and without additional commentary.
#             Python Unit Testing Instructions:

#             Write a unit test class utilizing the unittest framework.
#             Each test case should have its own method within the class, named descriptively to reflect its purpose.
#             Utilize assertions to compare the output of your solution to the expected output.
#             Include the necessary boilerplate to allow for the direct execution of the tests.
#             JavaScript Testing Instructions:

#             Outline your test cases as an array of objects, each specifying the input(s) and the expected output.
#             Use a loop to iterate over each test case, applying the solution function to the input(s) and employing console.assert to verify the output against the expected result.
#             Important Notes:

#             Avoid using markdown formatting, such as bold text or code blocks indicated by triple backticks, in your response.
#             Do not place quotation marks around the coding question prompt.
#             Ensure the test sections for both Python and JavaScript are properly formatted to be directly usable in their respective environments.
#             Example Format:

#             QUESTION PROMPT:
#             Describe your coding problem here, including any relevant constraints or details.

#             TEST CASES:

#             INPUT: [First input], [Second input if necessary]
#             OUTPUT: [Expected output]
#             INPUT: [First input], [Second input if necessary]
#             OUTPUT: [Expected output]
#             INPUT: [First input], [Second input if necessary]
#             OUTPUT: [Expected output]
#             PYTHON UNIT TESTING:

#             import unittest

#             class SolutionTest(unittest.TestCase):
#             def test_case_1(self):
#                 # Logic for test case 1
#                 self.assertEqual(actual_result, expected_result)

#             def test_case_2(self):
#                 # Logic for test case 2
#                 self.assertEqual(actual_result, expected_result)

#             def test_case_3(self):
#                 # Logic for test case 3
#                 self.assertEqual(actual_result, expected_result)

#             if __name__ == '__main__':
# #             unittest.main()

#             JAVASCRIPT UNIT TESTING:
#             const testCases = [
#                 {input: [First input], expected: [Expected output]},
#                 {input: [Second input], expected: [Expected output]},
#                 {input: [Third input], expected: [Expected output]}
#             ];

#             testCases.forEach(({input, expected}, index) => {
#                 console.assert(solution(...input) === expected, Test case ${index + 1} failed);
#             });
#         """
#     )

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
                - Assertion Example:
                testCases.forEach(({input, expected}, index) => {
                    const result = functionName(input); // functionName is your function
                    const arraysAreEqual = expected.every((value, index) => value === result[index]) && expected.length === result.length;
                    console.assert(arraysAreEqual, `Test case ${index + 1} failed with output ${result}`);
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
