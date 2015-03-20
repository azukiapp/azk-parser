#!/bin/bash

../bin/parse-javascript.js ./azkfile-code/systems.js -o ./azkfile-syntax/systems.js
../bin/parse-javascript.js ./azkfile-code/system.js  -o ./azkfile-syntax/system.js
../bin/parse-javascript.js ./azkfile-code/systems-with-systems.js  -o ./azkfile-syntax/systems-with-systems.js
../bin/parse-javascript.js ./azkfile-code/depends.js -o ./azkfile-syntax/depends.js
