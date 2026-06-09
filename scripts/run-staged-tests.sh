#!/usr/bin/env bash

# Get the staged files
diff_command="git diff --cached --name-only"
if [ "$1" == "--pushed" ]; then
  # Command to obtain all changes on this branch compared to development
  diff_command="git diff --name-only origin/development...HEAD"
fi

changed_files=$($diff_command)

web_changed=false
server_changed=false

for file in $changed_files; do
  if [[ $file == apps/web/* || $file == shared/common/* ]]; then
    web_changed=true
  elif [[ $file == apps/server/* ]]; then
    server_changed=true
  fi
done

# 1. Run Web/Common Tests if web or common files changed
if [ "$web_changed" = true ]; then
  echo "--- Web/Common workspace changes detected. Running Jest tests... ---"
  testing_directories=()
  all_these_files=()

  for file in $changed_files; do
    if [[ $file == apps/web/* || $file == shared/common/* ]]; then
      if [[ $file == apps/web/* ]]; then
        file_rel="${file#apps/web/}"
        prefix="apps/web/"
        strip_prefix="apps/web/"
      else
        file_rel="${file#shared/common/}"
        prefix="shared/common/"
        strip_prefix="shared/common/"
      fi

      dir=$(dirname "$file_rel")
      if [[ $file_rel == *"/__tests__/"* ]]; then
        test_dir="$dir"
      else
        test_dir="$dir/__tests__"
      fi

      if [ -d "$prefix$test_dir" ]; then
        if [[ ! " ${testing_directories[@]} " =~ " ${dir} " ]]; then
          test_files=$(find "$prefix$test_dir" \( -name "*.test.ts" -o -name "*.test.tsx" \) -type f 2>/dev/null)
          if [ -n "$test_files" ]; then
            for tf in $test_files; do
              if [ "$strip_prefix" == "apps/web/" ]; then
                all_these_files+=("${tf#apps/web/}")
              else
                all_these_files+=("../../$tf")
              fi
            done
          fi
          testing_directories+=($dir)
        fi
      fi
    fi
  done

  if [ ${#all_these_files[@]} -gt 0 ]; then
    echo "Running Jest on: ${all_these_files[*]}"
    cd apps/web && yarn test "${all_these_files[@]}" --watchAll=false
    web_test_exit_code=$?
    cd ../..
    if [ $web_test_exit_code -ne 0 ]; then
      echo "Web/Common tests failed!"
      exit $web_test_exit_code
    fi
  else 
    echo "No matching test files found for web/common changes."
  fi
fi

# 2. Run Server Tests if server files changed
if [ "$server_changed" = true ]; then
  echo "--- Server workspace changes detected. Running Cargo tests... ---"
  cd apps/server && cargo test
  server_test_exit_code=$?
  cd ../..
  if [ $server_test_exit_code -ne 0 ]; then
    echo "Server tests failed!"
    exit $server_test_exit_code
  fi
fi

echo "--- All checks passed successfully! ---"
exit 0