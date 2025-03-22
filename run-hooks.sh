#!/bin/bash

# Function to run lint and prettier commands safely
run_safely() {
  local folder="$1"
  local command_type="$2"
  
  # Check if there are any staged files in the specified folder
  local staged_files=$(echo "$STAGED_FILES" | tr ' ' '\n' | grep -E "^$folder/")
  
  if [ -n "$staged_files" ]; then

    echo "========================= Running $command_type for $folder =========================="
    # Get relative paths
    local relative_files=$(echo "$staged_files" | sed "s|^$folder/||g")
    
    # Change to the folder and run the command
    cd "$folder" || { echo "Failed to change directory to $folder"; return 1; }
    
    if [ "$command_type" = "lint" ]; then
      pnpm run lint $relative_files || { echo "$command_type failed for $folder"; cd - > /dev/null; return 1; }
    elif [ "$command_type" = "prettier" ]; then
      pnpm run -w prettier $staged_files || { echo "$command_type failed for $folder"; cd - > /dev/null; return 1; }
    fi
    
    # Return to the original directory
    cd - > /dev/null
    
    echo "$command_type for $folder completed successfully!"
  else
    echo "No staged files in $folder, skipping $command_type"
    echo "STAGED_FILES: $STAGED_FILES"
  fi
  
  return 0
}

# Combine all arguments into a single space-separated string of staged files
STAGED_FILES="$*"
if [ -z "$STAGED_FILES" ]; then
  echo "No staged files provided!"
  exit 0
fi

echo "Processing staged files: $STAGED_FILES"

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Track if any command failed
ERRORS=0

# Run lint commands
run_safely "frontend" "lint" || ERRORS=$((ERRORS + 1))
run_safely "backend/functions" "lint" || ERRORS=$((ERRORS + 1))
run_safely "landing" "lint" || ERRORS=$((ERRORS + 1))
run_safely "shared" "lint" || ERRORS=$((ERRORS + 1))

# Run prettier commands
run_safely "frontend" "prettier" || ERRORS=$((ERRORS + 1))
run_safely "backend/functions" "prettier" || ERRORS=$((ERRORS + 1))
run_safely "landing" "prettier" || ERRORS=$((ERRORS + 1))
run_safely "shared" "prettier" || ERRORS=$((ERRORS + 1))

# Check if there were any errors
if [ $ERRORS -gt 0 ]; then
  echo "Pre-commit hooks failed with $ERRORS error(s). Commit aborted."
  exit 1
fi

echo "All pre-commit hooks completed successfully!"
exit 0 