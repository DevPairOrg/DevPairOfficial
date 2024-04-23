"""
At the command line, only need to run once to install the package via pip:

$ pip install google-generativeai
"""

import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()


def initGlobalGeminiConvo():
  try:
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key is not None:
      genai.configure(api_key=api_key)
    else:
      print("Error: GEMINI_API_KEY environment variable not set.")
  except NameError:
    print("Error: 'genai' library not found. Please install it.")

  # Set up the model
  generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
  }

  safety_settings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
  ]

  model = genai.GenerativeModel(model_name="gemini-pro",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

  convo = model.start_chat(history=[
    {
      "role": "user",
      "parts": ["For the entire structured response STRICTLY DO NOT include any markdowns such as: (i.e. **BOLD**) (i.e. ```javascript) (i.e. ```python) Context: You are expected to generate a data structure and algorithm practice problem of easy or medium difficulty. Do not generate any problems with linked lists or binary trees. If 'user_solved_problems: <example comma separated list>' specified, do not generate any problems in this list as the user has already successfully solved these. The problem should simulate a real-world scenario and include a comprehensive description and detailed constraints. Only return the following keys: 'PROBLEM NAME', 'CONSTRAINTS', 'DIFFICULTY', and 'QUESTION PROMPT' and in JSON so I can parse with json.loads in python."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PROBLEM NAME\": \"Optimal Gas Station Refueling\",\n  \"CONSTRAINTS\": \"- 1 <= stations.length <= 200- 0 <= stations[i] <= 10^8- 1 <= k <= stations.length - 1- 0 <= m <= 2 * 10^9\",\n  \"DIFFICULTY\": \"Medium\",\n  \"QUESTION PROMPT\": \"You are driving a car that has a certain gas tank capacity and consumes a certain amount of gas per mile. You are given an array 'stations' where 'stations[i]' is the distance of the ith gas station from the start (0-indexed). You are also given an integer 'k', which is the maximum distance you can drive without refueling. Imagine that your car starts with an empty tank and you can add as many gallons of gas as your tank can hold at any gas station. Return the minimum number of refueling stops you need to reach the end, or -1 if you cannot reach the end.\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide empty functions for the problem you generated. The functions should be named according to the problem and include comments within the functions stating \"Your code goes here.\" Include two separate functions -- one for python and one for javascript. Python: Use pass instead of a return statement within the empty function. JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes). Parameters for both functions should not have a type assigned to them. Respond in JSON so I can parse with json.loads in python. DO NOT ADD TYPES TO THE FUNCTION PARAMETERSUse # for comments in python and // for comments in javascript"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON FUNCTION SIGNATURE\": \"def optimal_gas_station_refueling(stations, k, m):\\n  # Your code goes here\\n  pass\",\n  \"JAVASCRIPT FUNCTION SIGNATURE\": \"function optimal_gas_station_refueling(stations, k, m) {\\n  // Your code goes here\\n}\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide test cases for the problem you generated. Define at least three test cases as an array of objects, each with input and expected output. For each test case, include:--INPUT: The inputs needed to test the solution, with multiple parameters separated by SEMICOLONS and the parameter set to the variable it corresponds to in the function signature. (e.g., \"nums=[1,2,3]; target=3\"). DO NOT SEPARATE INPUT PARAMETERS WITH COMMAS USE SEMICOLONS. --OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt. Respond in JSON so I can parse with json.loads in python"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"TEST CASES\": [\n    {\n      \"INPUT\": \"stations=[10,19,3,17,25,4,22,23,12,11]; k=18; m=30\",\n    \"OUTPUT\": \"1\"\n  },\n  {\n    \"INPUT\": \"stations=[1,2,3,4,5,6,7,8,9,10]; k=1; m=3\",\n    \"OUTPUT\": \"-1\"\n  },\n  {\n    \"INPUT\": \"stations=[1,2,3,4,5,200]; k=4; m=4\",\n    \"OUTPUT\": \"4\"\n  }\n]}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to write 3 separate test snippets  for both javascript and python that defines the inputs as variables and console.logs or prints the function called with those input variables. The response should be in JSON so I can parse with json.loads in python. The snippets should leave room to add in the function. You should end the python test snippet with a newline character."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON_UNIT_TEST\": [\n    \"stations = [10,19,3,17,25,4,22,23,12,11];\\nk = 18;\\nm = 30;\\nprint(optimal_gas_station_refueling(stations, k, m))\\n\",\n    \"stations = [1,2,3,4,5,6,7,8,9,10];\\nk = 1;\\nm = 3;\\nprint(optimal_gas_station_refueling(stations, k, m))\\n\",\n    \"stations = [1,2,3,4,5,200];\\nk = 4;\\nm = 4;\\nprint(optimal_gas_station_refueling(stations, k, m))\\n\"\n  ],\n  \"JAVASCRIPT_UNIT_TEST\": [\n    \"const stations = [10,19,3,17,25,4,22,23,12,11];\\nconst k = 18;\\nconst m = 30;\\nconsole.log(optimal_gas_station_refueling(stations, k, m));\",\n    \"const stations = [1,2,3,4,5,6,7,8,9,10];\\nconst k = 1;\\nconst m = 3;\\nconsole.log(optimal_gas_station_refueling(stations, k, m));\",\n    \"const stations = [1,2,3,4,5,200];\\nconst k = 4;\\nconst m = 4;\\nconsole.log(optimal_gas_station_refueling(stations, k, m));\"\n  ]\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["For the entire structured response STRICTLY DO NOT include any markdowns such as: (i.e. **BOLD**) (i.e. ```javascript) (i.e. ```python)  Context: You are expected to generate a data structure and algorithm practice problem of easy or medium difficulty. Do not generate any problems with linked lists or binary trees. If 'user_solved_problems: <example comma separated list>' specified, do not generate any problems in this list as the user has already successfully solved these. The problem should simulate a real-world scenario and include a comprehensive description and detailed constraints. Only return the following keys: 'PROBLEM NAME', 'CONSTRAINTS', 'DIFFICULTY', and 'QUESTION PROMPT' and in JSON so I can parse with json.loads in python."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PROBLEM NAME\": \"Maximizing Revenue from Transactions\",\n  \"CONSTRAINTS\": \"- 1 <= nums.length <= 1000- 1 <= nums[i] <= 10^6\",\n  \"DIFFICULTY\": \"Easy\",\n  \"QUESTION PROMPT\": \"You are a trader who has access to a list of stock prices 'nums' for the next 'n' days. Each day, you can either buy one unit of stock, sell any number of stock units you currently hold, or do nothing. Determine the maximum profit you can make by following these rules, assuming you can only hold at most one unit of the stock at any time and you must sell the stock before the end of 'n' days.\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide empty functions for the problem you generated. The functions should be named according to the problem and include comments within the functions stating \"Your code goes here.\" Include two separate functions -- one for python and one for javascript. Python: Use pass instead of a return statement within the empty function. JavaScript: Keep the function empty with just the comment and avoid using arrow functions. Do not use Python comment syntax for JavaScript (triple quotes). Parameters for both functions should not have a type assigned to them. Respond in JSON so I can parse with json.loads in python. DO NOT ADD TYPES TO THE FUNCTION PARAMETERS. Use # for comments in python and // for comments in javascript"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON FUNCTION SIGNATURE\": \"def maximizing_revenue_from_transactions(nums):\\n  # Your code goes here\\n  pass\",\n  \"JAVASCRIPT FUNCTION SIGNATURE\": \"function maximizing_revenue_from_transactions(nums) {\\n  // Your code goes here\\n}\"\n}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to provide test cases for the problem you generated. Define at least three test cases as an array of objects, each with input and expected output.For each test case, include: --INPUT: The inputs needed to test the solution, with multiple parameters separated by SEMICOLONS and the parameter set to the variable it corresponds to in the function signature. (e.g., \"nums=[1,2,3]; target=3\"). DO NOT SEPARATE INPUT PARAMETERS WITH COMMAS USE SEMICOLONS. --OUTPUT: The expected output for the given inputs, presented as a straightforward value or description without elaboration. This should accurately reflect the prompt. Respond in JSON so I can parse with json.loads in python"]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"TEST CASES\": [\n    {\n      \"INPUT\": \"nums=[7,1,5,3,6,4]\",\n    \"OUTPUT\": \"5\"\n  },\n  {\n    \"INPUT\": \"nums=[1,2,3,4,5]\",\n    \"OUTPUT\": \"4\"\n  },\n  {\n    \"INPUT\": \"nums=[7,6,4,3,1]\",\n    \"OUTPUT\": \"0\"\n  }\n]}\n```"]
    },
    {
      "role": "user",
      "parts": ["Context: You are expected to write 3 separate test snippets for both javascript and python that defines the inputs as variables and console.logs or prints the function called with those input variables. The response should be in JSON so I can parse with json.loads in python. The snippets should leave room to add in the function. You should end the python test snippet with a newline character."]
    },
    {
      "role": "model",
      "parts": ["```json\n{\n  \"PYTHON_UNIT_TEST\": [\n    \"nums = [7,1,5,3,6,4]\\nprint(maximizing_revenue_from_transactions(nums))\\n\",\n    \"nums = [1,2,3,4,5]\\nprint(maximizing_revenue_from_transactions(nums))\\n\",\n    \"nums = [7,6,4,3,1]\\nprint(maximizing_revenue_from_transactions(nums))\\n\"\n  ],\n  \"JAVASCRIPT_UNIT_TEST\": [\n    \"const nums = [7,1,5,3,6,4];\\nconsole.log(maximizing_revenue_from_transactions(nums));\",\n    \"const nums = [1,2,3,4,5];\\nconsole.log(maximizing_revenue_from_transactions(nums));\",\n    \"const nums = [7,6,4,3,1];\\nconsole.log(maximizing_revenue_from_transactions(nums));\"\n  ]\n}\n```"]
    },
  ])

  # convo.send_message("Generate a unique leetcode problem that is not on leetcode and give us three test cases. Also give me the full solution with the function to test each individual case with my IDE")
  # print(convo.last.text)

  return convo
