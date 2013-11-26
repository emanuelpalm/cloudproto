#!/bin/bash

# Target name.
name=cloudproto

# Source library name.
srclib=sgl.min.js

echo -e "> Compiling Cloud Prototype"

echo -ne "Gathering all source data ......................"

for file in source/*.js
do
	data="$data$(<$file)\n\n"
done
echo -e " done!"

echo -ne "Writing all source data to single file ........."
cat "$srclib" > "$name".all.js
printf "$data" >> "$name".all.js
echo -e " done!"

echo -ne "Generating JSDoc3 documentation ................"
jsdoc "$name".all.js README.md
echo -e " done!"

echo -ne "Minifying gathered source data ................."
curl -s \
-d compilation_level=SIMPLE_OPTIMIZATIONS \
-d output_format=text \
-d output_info=compiled_code \
--data-urlencode "js_code@"$name".all.js" \
http://closure-compiler.appspot.com/compile \
> "$name".min.js
echo -e " done!"
