from flask import Blueprint
from ..gemini import initGlobalGeminiConvo

gemini_routes = Blueprint('gemini', __name__)


# initialize gemini chatbot
convo = initGlobalGeminiConvo()

@gemini_routes.route('/')
def getLeetCodeResponseBits():
    """
    This route breaks down the prompt into small bits for gemini 1.0 to consume and produce accurate responses; also to hopefully prevent recitation errors
    """
    print('🥱🥱🥱 Generating Problem, please wait.')


    convo.send_message(
        """
            IMPORTANT: Please adhere to the following structure when requesting solutions and tests for coding problems.

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)

            1. Pull a coding question from leetcode in the following format and do not assign types to the function parameters. Use just variable names:

            PROBLEM NAME:
            Name of Problem

            QUESTION PROMPT:
            Describe the coding problem here, including constraints or relevant details.
        """
    )

    name_and_prompt = convo.last.text

    convo.send_message(
        f"""
            IMPORTANT:
            - Please adhere to the following structure when requesting solutions and tests for coding problems.
            - Keep it relevant to our conversation, {name_and_prompt}

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)

            1. Empty Functions:
            Provide empty functions with names relevant to the problem.
            Include comments within the functions stating "Your code goes here."
            Include two separate functions -- one for python and one for javascript.
            Python: Use pass instead of a return statement within the empty function.
            JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes).
            Parameters for both functions should not have a type assigned to them.

            Follow this Example Format:

            EMPTY FUNCTION:
            def nameOfFunction(input parameters):
                # Your code goes here
                pass

            function nameOfFunction(input parameters) {{
                // Your code goes here
            }}
        """
    )

    default_function_names = convo.last.text

    convo.send_message(
        f"""
            IMPORTANT:
            - Please adhere to the following structure when requesting solutions and tests for coding problems.
            - Keep it relevant to our conversation, {name_and_prompt}

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)

            1. Test Cases:
            List no more than three test cases that are provided on leetcode.
            For each test case, include:
            INPUT: A detailed list of inputs needed to test the solution, with multiple parameters separated by commas. If there's a target, explicitly state it (e.g., "target=#").
            OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt.

            Follow the follwing example format:
            TEST CASES:
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]
            - INPUT: [First input], [Second input if necessary]
            - OUTPUT: [Expected output]
        """
    )

    test_cases = convo.last.text

    convo.send_message(
        f"""
            Important: Create a test in python based on the instructions provided below. The tests should all be relevant to the problem {name_and_prompt} response which you gave me in our previous conversation and test specifically for these {test_cases} you gave me.

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)
            (i.e. ##)
            (i.e. ###)

            1. Python Testing:
            Do not use unittest
            Define test cases as an list of objects, each with input and expected output (these keys should be inside quotations).
            Iterate over test cases, executing the solution function with each input and using expression to compare the result to the expected output in order to return a boolean.
            Make sure to be consistent with input formatting (e.g., keep lists as lists, don't spread them).

            For solutions returning arrays:
            Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.
            Use this method within console.assert to verify the expected array structure and content.

            Remember:
            Avoid using any markdown formatting like asterisks for bold text or backticks for code blocks.
            Maintain proper formatting for test case inputs and outputs.

            Follow the following example format:

            PYTHON UNIT TESTING:
            class SolutionTest:
                @staticmethod
                def run_test_case(input, expected):
                    result = nameOfFunction(input)
                    return result == expected

            def run_all_tests():
                test_suite = SolutionTest()
                test_results = []
                test_cases = [
                    {{'input': [First input], 'expected': [Expected output]}},
                    {{'input': [Second input], 'expected': [Expected output]}},
                    {{'input': [Third input], 'expected': [Expected output]}}
                ]
                for i, test_case in enumerate(test_cases, start=1):
                    input, expected = test_case['input'], test_case['expected']
                    result = test_suite.run_test_case(input, expected)
                    test_results.append((f"Test case {{i}}", result))
                return test_results

            if __name__ == '__main__':
                results = run_all_tests()
                for test_case, result in results:
                    print(f"{{test_case}}: {{True if result else False}}")
        """
    )

    python_test = convo.last.text

    convo.send_message(
        f"""
            Important: Create a unit test in javascript based on the instructions provided below. The tests should all be relevant to the problem {name_and_prompt} response which you gave me in our previous conversation and test specifically for these {test_cases} you gave me.

            For the entire structured response STRICTLY DO NOT include any markdowns such as:
            (i.e. **BOLD**)
            (i.e. ```javascript)
            (i.e. ```python)
            (i.e. ##)
            (i.e. ###)

            1. JavaScript Unit Testing:
            Define test cases as an array of objects, each with input and expected output.
            Iterate over test cases, executing the solution function with each input and using console.assert to compare the result to the expected output.
            Make sure to be consistent with input formatting (e.g., keep arrays as arrays, don't spread them).

            For solutions returning arrays:
            Implement a method to compare arrays by value and order using iteration and strict equality (===) for elements. Ensure the lengths are also equal.
            Use this method within console.assert to verify the expected array structure and content.

            Remember:
            Avoid using any markdown formatting like asterisks for bold text or backticks for code blocks.
            Maintain proper formatting for test case inputs and outputs.

            Follow the following example format:

            (do not include this line: these test cases should be pulled from leetcode)
            JAVASCRIPT UNIT TESTING:
            const testCases = [
                {{input: [First input], expected: [Expected output]}},
                {{input: [Second input], expected: [Expected output]}},
                {{input: [Third input], expected: [Expected output]}}
            ];

            (do not include this line: this test function below is explicitly an example for array comparisons for test cases. otherwise use a standard test case. if dealing with subarrays, implement a proper method for comparing the the subarray results to the expected results)
            testCases.forEach(({{ input, expected }}, index) => {{
                const result = nameOfFunction(input.nums, input.target);
                console.assert(arraysEqual(result, expected), `Test case ${{index + 1}} failed`);
                console.log(`Test case ${{index + 1}}`, JSON.stringify(expected) === JSON.stringify(result));
            }});

            function arraysEqual(a, b) {{
                return a.length === b.length && a.every((value, index) => value === b[index]);
            }}
        """
    )

    javascript_test = convo.last.text

    print('😁😁😁 name & prompt', name_and_prompt)
    print('😁😁😁 default fn names', default_function_names)
    print('😁😁😁 test cases', test_cases)
    print('😁😁😁 python tests', python_test)
    print('😁😁😁 javascript tests', javascript_test)
    return {'geminiResponse': name_and_prompt + '\n' + default_function_names + '\n' + test_cases + '\n' + python_test + '\n' + javascript_test}
