#!/usr/bin/env bash

# Get the staged files
diff_command="git diff --cached --name-only"
if [ "$1" == "--pushed" ]; then
  # Command to obtain all changes that will be pushed
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    diff_files="git diff --name-only origin/$current_branch..HEAD"
fi

changed_files=$($diff_command)
testing_directories=()
all_these_files=()

for file in $changed_files; do
  dir=$(dirname "$file")
  if [[ $file == *"/__tests__/"* ]]; then
    test_dir="$dir"
  else
    test_dir="$dir/__tests__"
  fi
    if [ -d "$test_dir" ]; then
        if [[ ! " ${testing_directories[@]} " =~ " ${dir} " ]]; then
            test_files=$(find "$test_dir" \( -name "*.test.ts" -o -name "*.test.tsx" \) -type f)
            all_these_files+=($test_files) 
            testing_directories+=($dir)
        fi
    fi
done

if [ ${#all_these_files[@]} -gt 0]; then
    yarn test "${all_these_files[@]}"
else 
    echo "No test files found"
    exit 0
fi