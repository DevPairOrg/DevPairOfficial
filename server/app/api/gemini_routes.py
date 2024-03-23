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

    # UPDATED PROMPT
    convo.send_message(
        """
            When requesting solutions and tests for coding problems, please adhere to the following structured format:

            IMPORTANT: EXPLICITLY DO NOT DO THE FOLLOWING a-b
                a. DO NOT INCLUDE ANY SORT OF MARKDOWN FOR THE RESPONSE SUCH AS MAKING THINGS **BOLD**
                b. DO NOT INCLUDE BACKTICKS TO INDICATE A BLOCK OF CODE
                c. DO NOT INCLUDE QUOTATATIONS AROUND THE QUESTION PROMPT

            1. Provide a clear and concise coding question prompt, including any specific constraints or important details. The question should ideally reflect typical coding challenges or algorithmic problems, preferrably from leetcode.

            2. List exactly three test cases for the problem. For each test case, include:
            - INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas.
            - OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration.

            3. For Python, create a unit test class using the `unittest` framework. This class should:
            - Include a method for each test case, descriptively named to reflect the test’s intent.
            - Use assertions to compare the solution's output to the expected output.
            - Conclude with the standard boilerplate allowing direct execution of the tests.
            -

            4. For JavaScript, outline a simple testing setup using console assertions. This setup should:
            - Define test cases as an array of objects, each with input and expected output.
            - Iterate over test cases, executing the solution function with each input and using `console.assert` to compare the result to the expected output.

            Ensure both testing sections are correctly formatted for their respective languages.

            EXAMPLES OF MARKDOWNS TO NOT INCLUDE:
            **JAVASCRIPT UNIT TESTING:**
            ```javascript
            ```python

            CORRECT & PROPER EXAMPLE:

            QUESTION PROMPT:
            "Describe the coding problem here, including constraints or relevant details."

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
                console.assert(solution(...input) === expected, `Test case ${index + 1} failed`);
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
