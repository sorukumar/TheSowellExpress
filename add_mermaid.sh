#!/bin/bash

# Path to the directory containing the generated HTML files
OUTPUT_DIR="book"

# Append the script to each HTML file
for file in "$book"/*.html; do
    # Use awk to insert the script before the closing </body> tag
    awk '
    /<\/body>/ {
        print "<script type=\"module\">"
        print "import mermaid from \"https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs\";"
        print "mermaid.initialize({ startOnLoad: true });"
        print "</script>"
    }
    { print }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
done