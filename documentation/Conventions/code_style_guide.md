# Code style guide

This guide follows the Javascript Standard style guide and the appropriate extension must be installed in vscode

## 1 Newlines
- use UNIX-style newlines (\n), and a newline character as the last character of a file. Windows-style newlines (\r\n) are forbidden inside any repository.
- No trailing whitespace
- Do not use Semicolons
- Max 80 characters per line
- Use single quotes, unless you are writing JSON.
- Opening braces go on the same line
- Your opening braces go on the same line as the statement.
- Declare one variable per var statement
- Declare one variable per var statement, it makes it easier to re-order the lines. However, ignore Crockford when it comes to declaring variables deeper inside a function, just put the declarations wherever they make sense.

## 2 Naming Conventions
- Use lowerCamelCase for variables, properties and function names
- Variables, properties and function names should use lowerCamelCase. They should also be descriptive. Single character variables and uncommon abbreviations should generally be avoided.
- Use UpperCamelCase for class names
- Class names should be capitalized using UpperCamelCase.
- Use UPPERCASE for Constants

## 3 Conditionals
- Use the === operator

## 4 Functions
- Write small functions
- Keep your functions short. A good function fits on a slide that the people in the last row of a big room can comfortably read. So don't count on them having perfect vision and limit yourself to ~15 lines of code per function.
- Return early from functions
- To avoid deep nesting of if-statements, always return a function's value as early as possible.

## 5 Comments
- Use slashes for comments
- Use slashes for both single line and multi line comments. Try to write comments that explain higher level mechanisms or clarify difficult segments of your code. Don't use comments to restate trivial things.

Information obtained from here https://standardjs.com/

