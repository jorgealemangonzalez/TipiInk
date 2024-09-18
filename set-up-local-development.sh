#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
# Exit if any command in a pipeline fails
set -o pipefail

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo "gcloud is not installed. Please install it from https://cloud.google.com/sdk."
  exit 1
fi

# Check user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "You are not authenticated. Logging in..."
    gcloud auth login
fi

# Attempt to retrieve an access token using ADC
TOKEN=$(gcloud auth application-default print-access-token 2>/dev/null)

# Check if the token is empty
if [ -z "$TOKEN" ]; then
    echo "Error: Google Application Default Credentials (ADC) are not set up. Setting them up..."
    gcloud auth application-default login
    gcloud auth application-default set-quota-project tipi-ink
else
    echo "Google Application Default Credentials (ADC) are set up."
fi



