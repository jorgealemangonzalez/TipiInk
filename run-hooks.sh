#!/bin/bash

# Function to run lint and prettier commands safely
run_safely() {
  local folder="$1"
  local command_type="$2"
  local path_prefix="$3"
  local command="$4"
  local file_pattern="$5"

  echo "Running $command_type for $folder..."
  
  # Check if there are any staged files in the specified folder
  local staged_files=$(echo "$STAGED_FILES" | grep -E "^$path_prefix/")
  
  if [ -n "$staged_files" ]; then
    # Get relative paths
    local relative_files=$(echo "$staged_files" | sed "s|^$path_prefix/||g")
    
    # Change to the folder and run the command
    cd "$folder" || { echo "Failed to change directory to $folder"; return 1; }
    
    if [ "$command_type" = "lint" ]; then
      pnpm run lint $relative_files || { echo "$command_type failed for $folder"; cd - > /dev/null; return 1; }
    elif [ "$command_type" = "prettier" ]; then
      pnpm run prettier "$file_pattern" -w -c --config .prettierrc || { echo "$command_type failed for $folder"; cd - > /dev/null; return 1; }
    fi
    
    # Return to the original directory
    cd - > /dev/null
    
    echo "$command_type for $folder completed successfully!"
  else
    echo "No staged files in $folder, skipping $command_type"
  fi
  
  return 0
}

# Fetch staged files
STAGED_FILES="$1"
if [ -z "$STAGED_FILES" ]; then
  echo "No staged files provided!"
  exit 0
fi

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Run lint commands
run_safely "frontend" "lint" "frontend" "pnpm run lint" ""
run_safely "backend/functions" "lint" "backend" "pnpm run lint" ""
run_safely "landing" "lint" "landing" "pnpm run lint" ""
run_safely "shared" "lint" "shared" "pnpm run lint" ""

# Run prettier commands
run_safely "frontend" "prettier" "frontend" "pnpm run prettier" "frontend/src"
run_safely "backend/functions" "prettier" "backend" "pnpm run prettier" "backend/functions/src"
run_safely "landing" "prettier" "landing" "pnpm run prettier" "landing/src"
run_safely "shared" "prettier" "shared" "pnpm run prettier" "shared/src"

echo "All pre-commit hooks completed successfully!"
exit 0 