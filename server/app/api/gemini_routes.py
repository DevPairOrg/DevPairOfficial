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
    convo.send_message(
        """
            Please provide the following information EXACTLY HOW I AM OUTLINING:
            -A random LeetCode Coding Question Prompt
            -THREE Test Cases (input and output pairs)
            -Create a unit test for the test cases against the user's solution.
            You MUST ensure the response structure is EXACTLY HOW I AM OUTLINING. Thank you!
            YOUR RESPONSE EXAMPLE STRUCTURE:
            QUESTION PROMPT:
            (insert full LeetCode question prompt here)
            TEST CASES:
            (EXAMPLE STRUCTURE MUST FOLLOW:
            - INPUT: (input goes here here. must be comma separated if more than one parameter exists)
            - OUTPUT: (output value goes here. NO EXPLANATION!)
            )
            UNIT TESTING:
            (Create a unit test for the test cases against the user's solution that will return a boolean)
        """
    )
    print(convo.last.text)
    return {'geminiResponse': convo.last.text}
