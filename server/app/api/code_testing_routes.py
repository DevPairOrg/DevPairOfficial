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

    print('😚😉😎🙂☺🙂🤗😋', '\n', problem_unit_test)

    if code is None:
        return jsonify({'error': 'No code provided'}), 400

    # Determine the file path and write mode based on the language
    file_path = userPythonTestPath if language == 'python' else userJavascriptTestPath
    write_mode = 'w' if language == 'python' else 'w'

    # Combine user code and unit tests into one file
    full_code = code + "\n\n" + problem_unit_test

    try:
        with open(file_path, write_mode) as file:
            file.write(full_code)
    except IOError as e:
        return jsonify({'error': f'File write error: {str(e)}'}), 500

    # Execute the tests
    try:
        if language == 'python':
            test_output = subprocess.check_output(['python', file_path], stderr=subprocess.STDOUT)
            test_result = test_output.decode('utf-8')
        elif language == 'javascript':
            test_output = subprocess.check_output(['node', file_path], stderr=subprocess.STDOUT)
            test_result = test_output.decode('utf-8')
        else:
            return jsonify({'error': f"Testing for language '{language}' not implemented"}), 400
    except subprocess.CalledProcessError as e:
        test_result = e.output.decode('utf-8')

    return jsonify({
        'message': 'Unit test results',
        'test_output': test_result
    })
