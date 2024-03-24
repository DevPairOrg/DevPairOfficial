from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from io import StringIO
import subprocess, sys, asyncio, pathlib, os, unittest, json
from deno_vm import VM

code_testing_routes = Blueprint('problem', __name__)

userPythonTestPath = './app/user_tests/user_test.py'
userJavascriptTestPath = './app/user_tests/user_test.js'
pythonTest = '''
if __name__ == "__main__":
    a = int(sys.argv[1])
    b = int(sys.argv[2])
    result = int(sys.argv[3])
    print(add(a, b) == result)
'''
javascriptTest = '''
if (require.main === module) {
    const a = parseInt(process.argv[2]);
    const b = parseInt(process.argv[3]);
    const expectedResult = parseInt(process.argv[4]);
    console.log(add(a, b) === expectedResult);
}
'''

@login_required
@code_testing_routes.route('/add-two-sum', methods=['POST'])
def add_two_sum():
    code = request.json.get('code')
    language = request.json.get('language')

    if code is None:
        return jsonify({'error': 'No code provided'}), 400

    if code:
        with open(userPythonTestPath if language == 'python' else userJavascriptTestPath, 'w') as file:
            if language == 'python':
                file.write('import sys\n')
                file.write(code + '\n')
            else:
                file.write(code + '\n')
        with open(userPythonTestPath if language == 'python' else userJavascriptTestPath, 'a') as file:
            file.write((pythonTest.strip() + '\n') if language == 'python' else (javascriptTest.strip() + '\n'))

        test_cases = [
        ["1", "2", "3"],
        ["4", "5", "9"],
        ["6", "7", "13"]
        ]
        test_results = []

        for case in test_cases:
            try:
                args = ['python' if language == 'python' else 'node', userPythonTestPath if language  == 'python' else userJavascriptTestPath] + case
                completed_process = subprocess.run(args, capture_output=True, text=True)
                if completed_process.returncode == 0:
                    # Process the output if needed
                    output = completed_process.stdout.strip()
                    # test_results.append({'case': case, 'result': output.strip(), 'success': True})
                    test_results.append({'passOrFail': True if output.strip() == 'True' or output.strip() == 'true' else False}) # bool() turns False into True, so we have to use a ternary
                else:
                    error_message = completed_process.stderr
                    test_results.append({'case': case, 'error': error_message, 'success': False})
            except Exception as e:
                test_results.append({'case': case, 'error': str(e), 'success': False})
        return jsonify({'message': 'Tests executed', 'results': test_results})


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

# def run_python_tests(path):
#     """
#     Run User Solutions in Python
#     """
#     test_output = subprocess.check_output(['python', path], stderr=subprocess.STDOUT)
#     return test_output.decode('utf-8')

# def run_javascript_tests(code, unit_test, test_cases):
#     """
#     Run User Solutions in JavaScript
#     """
#     # Prepare the full test code by combining the user code with the test script
#     full_test_code = code + '\n' + unit_test.strip() + '\n'
#     test_results = []

#     # Write the combined code and test script to the JavaScript test file
#     with open(userJavascriptTestPath, 'w') as file:
#         file.write(full_test_code)

#     # Iterate over each test case and execute the test
#     for case in test_cases:
#         args = ['node', userJavascriptTestPath] + case
#         try:
#             completed_process = subprocess.run(args, capture_output=True, text=True, check=True)
#             output = completed_process.stdout.strip()
#             # Determine pass or fail based on the output and append the result
#             test_results.append({'passOrFail': True if output == 'true' else False})
#         except subprocess.CalledProcessError as e:
#             # In case of a subprocess error, capture the error output
#             error_message = e.stderr.strip()
#             test_results.append({'case': case, 'error': error_message, 'success': False})
#         except Exception as e:
#             # Handle any other exceptions and record the error
#             test_results.append({'case': case, 'error': str(e), 'success': False})

#     return test_results
