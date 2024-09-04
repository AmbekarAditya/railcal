#!/bin/bash

# Define the output file
output_file="all_tsx_files_content.txt"

# Clear the output file if it already exists
> "$output_file"

# Find all .tsx files in the current directory and subdirectories, excluding node_modules and any other third-party directories
find . -type f -name "*.tsx" ! -path "*/node_modules/*" ! -path "*/.*/node_modules/*" | while read -r file; do
  # Write the filename to the output file
  echo "File: $file" >> "$output_file"
  echo "----------------------------------------" >> "$output_file"
  # Write the content of the file to the output file
  cat "$file" >> "$output_file"
  echo -e "\n\n" >> "$output_file"
done

echo "All .tsx files have been read and added to $output_file."
