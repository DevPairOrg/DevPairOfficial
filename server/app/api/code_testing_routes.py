from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from io import StringIO
import subprocess, sys, asyncio, pathlib, os, unittest, json
import pprint

code_testing_routes = Blueprint('problem', __name__)

userPythonTestPath = './app/user_tests/user_test.py'
userJavascriptTestPath = './app/user_tests/user_test.js'

@login_required
@code_testing_routes.route('/test', methods=['POST'])
def unit_test():
    request_data = request.get_json()
    code = request_data.get('code')
    language = request_data.get('language')
    problem_unit_test = request_data.get('problemUnitTest')
    test_result = {}

    print('😚😉😎🙂☺🙂🤗😋', '\n', problem_unit_test)

    if code is None:
        return jsonify({'error': 'No code provided'}), 400

    # Determine the file path and write mode based on the language
    file_path = userPythonTestPath if language == 'python' else userJavascriptTestPath
    write_mode = 'w' if language == 'python' else 'w'

    # Combine user code and unit tests into one file
    full_code = code + "\n\n" + problem_unit_test

    # Determine the test file based on language
    testing_language = 'python' if language == 'python' else 'node'

    try:
        with open(file_path, write_mode) as file:
            file.write(full_code)
    except IOError as e:
        return jsonify({'error': f'File write error: {str(e)}'}), 500

    # Execute the tests
    try:
        test_output = subprocess.check_output([testing_language, file_path], stderr=subprocess.STDOUT).decode('utf-8')
        print('🐔 Test Output', test_output)

        test_result = {
            "testCase1": {"userOutput": None, "expected": None, "assert": None},
            "testCase2": {"userOutput": None, "expected": None, "assert": None},
            "testCase3": {"userOutput": None, "expected": None, "assert": None}
        }

        for index, line in enumerate(test_output.split('NEXT ELEMENT')):
            if index == 0:
                test_result["testCase1"]["userOutput"] = line.strip()
            elif index == 1:
                test_result["testCase1"]["expected"] = line.strip()
            elif index == 2:
                test_result["testCase1"]["assert"] = line.strip()

            elif index == 3:
                test_result["testCase2"]["userOutput"] = line.strip()
            elif index == 4:
                test_result["testCase2"]["expected"] = line.strip()
            elif index == 5:
                test_result["testCase2"]["assert"] = line.strip()

            elif index == 6:
                test_result["testCase3"]["userOutput"] = line.strip()
            elif index == 7:
                test_result["testCase3"]["expected"] = line.strip()
            elif index == 8:
                test_result["testCase3"]["assert"] = line.strip()

        print("TEST RESULTS 😈😈😈😈😈😈😈😈😈😈😈😈😈😈")
        pretty_output = pprint.pformat(test_result)
        print(pretty_output)


    except subprocess.CalledProcessError as e:
        # Handle process errors, for example, when the test script itself fails
        test_result = {'error': e.output.decode('utf-8')}

    return jsonify({
        'message': 'Unit test results',
        'testResults': test_result
    })
