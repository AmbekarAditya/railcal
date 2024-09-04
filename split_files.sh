#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 filename n"
    exit 1
fi

# Assign arguments to variables
filename=$1
n=$2

# Check if the file exists
if [ ! -f "$filename" ]; then
    echo "File not found!"
    exit 1
fi

# Get the total number of lines in the file
total_lines=$(wc -l < "$filename")

# Calculate the number of lines per part
lines_per_part=$((total_lines / n))

# Check if the number of parts is greater than the total lines
if [ "$lines_per_part" -eq 0 ]; then
    echo "Number of parts is greater than the number of lines in the file!"
    exit 1
fi

# Split the file with a custom suffix length of 3 (to avoid conflicts with .txt extension)
split -l "$lines_per_part" -d -a 3 "$filename" part_

# Rename each part to have a .txt extension
for file in part_*; do
    mv "$file" "${file}.txt"
done

# If there are remaining lines, distribute them among the parts
remaining_lines=$((total_lines % n))
if [ "$remaining_lines" -ne 0 ]; then
    part_files=($(ls part_*.txt))
    for (( i=0; i<$remaining_lines; i++ )); do
        line=$(sed -n "$((total_lines-remaining_lines+i+1))p" "$filename")
        echo "$line" >> "${part_files[$i]}"
    done
fi

echo "File has been split into $n parts with .txt extension."
