#!/bin/bash

# How to use
# run `sh setup.sh` in the terminal

# Stop the script if any command fails
set -e

# File name
env_file=".env"

# FRONTEND / CLIENT
# Navigate to the client directory -- run npm commands and create a default .env file
echo "Installing client dependencies..."
cd client

# Check if the .env file already exists
if [ ! -f "$env_file" ]; then
    # Create the .env file and add example values
    echo "Creating .env file with example values..."

    # Using echo to add lines to the .env file
    echo "VITE_APP_ID=<your app id>" > "$env_file" # > creates and overwrites
    echo "APP_CERTIFICATE=<your certificate>" >> "$env_file" # >> appends
    echo "RTC_TOKEN=<your rtc token>" >> "$env_file"
    echo "VITE_X_AUTH_TOKEN=<your judget0 auth token>" >> "$env_file"
    echo "VITE_X_AUTH_USER=<your judge0 auth user>" >> "$env_file"

    echo ".env file created."
else
    echo ".env file already exists."
fi

# Install client packages/dependencies
npm install

echo "Completed installing client dependencies."

cd ..

# BACKEND / SERVER
# Navigate to the server directory and run pip commands
echo "Installing server dependencies..."
cd server

# Check if the .env file already exists
if [ ! -f "$env_file" ]; then
    # Create the .env file and add default values
    echo "Creating .env file with default values..."

    # Generate a UUID for the SECRET_KEY
    secret_key=$(uuidgen)

    # Using echo to add lines to the .env file
    echo "SECRET_KEY=$secret_key" > "$env_file" # > creates and overwrites
    echo "DATABASE_URL=sqlite:///dev.db" >> "$env_file" # >> appends
    echo "SCHEMA=devpairofficial" >> "$env_file"
    echo "GEMINI_API_KEY=<your gemini api key>" >> "$env_file"
    echo "RAPID_API_KEY=<your rapid api key>" >> "$env_file"
    echo "RAPID_API_HOST=<your rapid host url>" >> "$env_file"
    echo "S3_IMAGE_BUCKET=<your aws bucket>" >> "$env_file"
    echo "S3_IMAGE_KEY=<your aws key>" >> "$env_file"
    echo "S3_IMAGE_SECRET=<your aws secret>" >> "$env_file"

    echo ".env file created."
else
    echo ".env file already exists."
fi

# Function to run commands using pipenv
run_with_pipenv() {
    echo "Using pipenv to install dependencies and run migrations."
    pipenv run pip install -r requirements.txt
    # Check if migrations folder exists
    if [ ! -d "migrations" ]; then
        echo "Migrations folder not found. Initializing migrations..."
        pipenv run flask db init
    else
        echo "Migrations folder found. Skipping initialization."
    fi
    pipenv run flask seed undo
    pipenv run flask db upgrade
    pipenv run flask db migrate
    pipenv run flask db upgrade
    pipenv run flask seed all
}

# Function to run commands in the activated virtual environment
run_with_venv() {
    echo "Using virtual environment to install dependencies and run migrations."
    pipenv install -r requirements.txt
    # Check if migrations folder exists
    if [ ! -d "migrations" ]; then
        echo "Migrations folder not found. Initializing migrations..."
        flask db init
    else
        echo "Migrations folder found. Skipping initialization."
    fi
    flask seed undo
    flask db upgrade
    flask db migrate
    flask db upgrade
    flask seed all
}

# Attempt to activate the virtual environment if it's not already activated
if [ -d .venv ] || [ -f .venv ]; then
    echo "Virtual environment found."
    # Check if we're already in a virtual environment
    if [[ -z "$VIRTUAL_ENV" ]]; then # -z is a conditional that checks if $VIRTUAL_ENV is empty/null, if it is empty then it proceeds to activate one
        echo "Activating virtual environment..."
        source .venv/bin/activate
    else
        echo "Virtual environment already activated."
    fi # fi indicates the end of the block and proceeds to run anything after this.
    run_with_venv
else
    echo "Virtual environment not found. Using pipenv."
    run_with_pipenv
fi

# Navigate back to the previous directory
cd ..


echo "Build and setup completed successfully!"
