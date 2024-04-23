import json
from flask import Blueprint, request

from .utils import error_response
from ..gemini import initGlobalGeminiConvo
from app.models import User, db
import json
from .utils import error_response

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

    # GENERAT PROBLEM NAME AND DESCRIPTION

    for _ in range(5):
        try:
            convo.send_message(
            f"""
                For the entire structured response STRICTLY DO NOT include any markdowns such as:
                (i.e. **BOLD**)            (i.e. ```javascript)            (i.e. ```python)  

                Context: You are expected to generate a data structure and algorithm practice problem of easy or medium difficulty. Do not generate any problems with linked lists or binary trees. If 'user_solved_problems: <example comma separated list>' specified, do not generate any problems in this list as the user has already successfully solved these. The problem should simulate a real-world scenario and include a comprehensive description and detailed constraints. Only return the following keys: 'PROBLEM NAME', 'CONSTRAINTS', 'DIFFICULTY', and 'QUESTION PROMPT' and in JSON so I can parse with json.loads in python.

                user_solved_problems: {prev_solved_questions}
            
            """
            )
            md_name = convo.last.text
            json_name = md_name.replace("```json", "").replace("```", "").strip()
            name_and_prompt = json.loads(json_name)
            break
        except Exception as e:
            print('🥱🥱🥱 Error generating name and prompt, trying again...', e)
    else:
        print("Failed to send message after 5 attempts")
        return error_response("There was an error retrieving a response from Gemini, please try again later.", 500)

    # GENERATE FUNCTION SIGNATURES

    for _ in range(5):
        try:
            convo.send_message(
            f"""
                Context: You are expected to provide empty functions for the problem you generated. The functions should be named according to the problem and include comments within the functions stating "Your code goes here." Include two separate functions -- one for python and one for javascript. Python: Use pass instead of a return statement within the empty function. JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes). Parameters for both functions should not have a type assigned to them. Respond in JSON so I can parse with json.loads in python.           
                DO NOT ADD TYPES TO THE FUNCTION PARAMETERS
                Use # for comments in python and // for comments in javascript
            
            """
            )

            md_funcs = convo.last.text
            json_funcs = md_funcs.replace("```json", "").replace("```", "").strip()
            default_function_names = json.loads(json_funcs)
            break
        except Exception as e:
            print('🥱🥱🥱 Error generating function signatures, trying again...', e)
    else:
        print("Failed to send message after 5 attempts")
        return error_response("There was an error retrieving a response from Gemini, please try again later.", 500)

    # GENERATE TEST CASES
    for _ in range(5):
        try:
            convo.send_message(
            f"""
                Context: You are expected to provide test cases for the problem you generated. Define at least three test cases as an array of objects, each with input and expected output.            
                For each test case, include:            
                --INPUT: The inputs needed to test the solution, with multiple parameters separated by SEMICOLONS and the parameter set to the variable it corresponds to in the function signature. (e.g., "nums=[1,2,3]; target=3"). DO NOT SEPARATE INPUT PARAMETERS WITH COMMAS USE SEMICOLONS. 

                --OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt.
                Respond in JSON so I can parse with json.loads in python
            
            """
            )

            md_tests = convo.last.text
            json_tests = md_tests.replace("```json", "").replace("```", "").strip()
            test_cases = json.loads(json_tests)
            break
        except Exception as e:
            print('🥱🥱🥱 Error generating test cases, trying again...', e)
    else:
        print("Failed to send message after 5 attempts")
        return error_response("There was an error retrieving a response from Gemini, please try again later.", 500)

    # GENERATE UNIT TESTS

    for _ in range(5):
        try:
            convo.send_message(
            f"""
                Context: You are expected to write 3 separate test snippets  for both javascript and python that defines the inputs as variables and console.logs or prints the function called with those input variables. The response should be in JSON so I can parse with json.loads in python. The snippets should leave room to add in the function. You should end the python test snippet with a newline character.
            
            """
            )

            md_units = convo.last.text
            json_units = md_units.replace("```json", "").replace("```", "").strip()
            unit_tests = json.loads(json_units)
            break
        except Exception as e:
            print('🥱🥱🥱 Error generating unit tests, trying again...', e)
    else:
        print("Failed to send message after 5 attempts")
        return error_response("There was an error retrieving a response from Gemini, please try again later.", 500)




    print('😁😁😁 name & prompt', name_and_prompt)
    print('😁😁😁 default fn names', default_function_names)
    print('😁😁😁 test cases', test_cases)
    print('😁😁😁 unit tests', unit_tests)
    return {'geminiResponse': {**name_and_prompt, **default_function_names, **test_cases, **unit_tests}}
