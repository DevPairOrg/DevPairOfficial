from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv
load_dotenv()
from pprint import pprint

judge0_routes = Blueprint('judge0', __name__)
rapid_api_key = os.getenv('RAPID_API_KEY')
rapid_api_host = os.getenv('RAPID_API_HOST')

@judge0_routes.route('/auth', methods=['POST'])
def authenticate_token():
    url = 'https://judge0-ce.p.rapidapi.com/authenticate'
    headers = {
        "X-Auth-Token": rapid_api_key,
    }
    try:
        response = requests.post(url, headers=headers)
        print(response)
        return response
    except Exception as e:
        print('ERRROORRRRR ----->', e)

@judge0_routes.route('/auth2', methods=['POST'])
def authorize_token():
    url = 'https://judge0-ce.p.rapidapi.com/authorize'
    headers = {
        "X-Auth-User": rapid_api_key,
    }
    try:
        response = requests.post(url, headers=headers)
        print(response)
        return response
    except Exception as e:
        print('ERRROORRRRR ----->', e)
        return e

@judge0_routes.route('/test')
def get_submission_test():
    print('HELLOOOOOOOOOO')  # Debug print

    url = "https://judge0-ce.p.rapidapi.com/submissions/06a26a12-50ab-4fe0-9d84-a9dd8f5611ac"
    querystring = {"base64_encoded":"true","fields":"*"}

    headers = {

        "X-RapidAPI-Host": rapid_api_host
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
        response_data = response.json()
        print("😁😁😁 Response Data:", response_data)  # Debug print
        return jsonify(response_data)
    except requests.exceptions.HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')  # Python 3.6+
        return jsonify({"error": str(http_err)}), response.status_code
    except ValueError as json_err:
        print(f'JSON decode error: {json_err}')  # Python 3.6+
        return jsonify({"error": "Response content is not valid JSON"}), 500
    except Exception as e:
        print(f'Other error occurred: {e}')  # Python 3.6+
        return jsonify({"error": str(e)}), 500


# Creates a submission (takes a language_id, source code, input data (stdin))
# Returns a TOKEN to check the response of the submission
@judge0_routes.route('/create', methods=['POST'])
def createSubmission():
    source_code = """
    const input = require('fs').readFileSync(0, 'utf-8').trim().split(' ');
    const a = parseInt(input[0].split('=')[1]);
    const b = parseInt(input[1].split('=')[1]);
    console.log(twoSum(a, b));

    function twoSum(a, b) {
        return a + b;
    }
    """

    url = "https://judge0-ce.p.rapidapi.com/submissions"

    querystring = {"base64_encoded":"false","fields":"*","wait":"true"}

    payload = {
        "language_id": 63,
        "source_code": source_code,
        "stdin": "a=5 b=3",
        "expected_output": "8\n"
    }

    headers = {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": rapid_api_key,
        "X-RapidAPI-Host": rapid_api_host
    }

    response = requests.post(url, json=payload, headers=headers, params=querystring)

    print('🤗☺😏😶🤗🙂🙂 RESPONSE', response.json())
    return jsonify(response.json())


@judge0_routes.route('/proxy', methods=['POST'])
def proxy():
    target_url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*'

    try:
        headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': request.headers.get('X-Auth-Token'),
            'X-Auth-User': request.headers.get('X-Auth-User')
        }

        response = requests.post(
            target_url,
            json=request.get_json(),  # Forwarding the JSON payload directly
            headers=headers,
            verify=True  # SSL verification
        )
         # Check for both 200 and 201 success codes
        if response.status_code in (200, 201):
            response_data = response.json()
            print('MAKING A SUBMISSION 🥶🥶😳🥶🥶🥶🥶🥶🥶🥶😳🥶🥶')
            pprint(response_data)
            print('🙂🤩😶😑😚😋🙂 response.json() SUCCESS')
            pprint(response.json())
            return jsonify(response_data), response.status_code
        else:
            # Log unexpected status codes with response body
            print(f'Unexpected status code received: {response.status_code}', response)
            print('🙂🤩😶😑😚😋🙂 response.json() FAILURE')
            pprint(response.json())
            return jsonify({'error': 'Unexpected response from the API', 'status': response.status_code, 'body': response}), response.status_code

    except requests.RequestException as e:
        print('Request failed:', str(e))
        return jsonify({'error': f"Service unavailable: {e}"}), 503
    except ValueError as e:
        # Catch JSON decode errors
        print('JSON decoding failed:', str(e))
        return jsonify({'error': 'Failed to decode JSON from response'}), 503
