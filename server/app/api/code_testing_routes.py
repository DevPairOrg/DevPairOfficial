from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from io import StringIO
import subprocess, sys, asyncio, pathlib, os, unittest, json
from deno_vm import VM

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
        for line in test_output.split('\n'):
            parts = line.split()  # Split the line into parts by whitespace
            if len(parts) >= 3:
                # Handle 'Assertion failed' similarly in Python and JavaScript
                if parts[0] == 'Assertion' and parts[1] == 'failed:':
                    # Construct the key without 'Assertion failed:'
                    key = " ".join(parts[2:-1])
                else:
                    key = " ".join(parts[:-1])

                result = parts[-1].lower() == 'true'
                test_result[key.strip()] = result
            elif line.strip():  # Check if the line is not just empty or whitespace
                print(f"Warning: Line does not conform to expected format and will be skipped: '{line}'")

        print('😋😋😋😋😋😋😋😋 test_result: ', test_result)

    except subprocess.CalledProcessError as e:
        # Handle process errors, for example, when the test script itself fails
        test_result = {'error': e.output.decode('utf-8')}

    return jsonify({
        'message': 'Unit test results',
        'testResults': test_result
    })
