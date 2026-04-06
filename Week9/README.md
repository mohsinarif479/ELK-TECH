# Week 9 Exercises

This folder contains Node.js exercises for Week 9 covering advanced event-loop topics, CLI tools, streams, and error handling.

## Learning Goals

- Understand Node.js event loop phases and asynchronous execution patterns
- Build command-line tools using `process.argv`
- Use Node.js streams for efficient file reading and writing
- Implement advanced error handling for missing files and invalid input

## Exercises

1) `exercises/word-frequency.js`
   - Build a CLI tool that counts the frequency of each word in a large text file.
   - Use readable streams and line-by-line processing instead of reading the entire file into memory.
   - Accept a file path and optional output file path from the command line.
   - Handle errors for missing files, unreadable files, and invalid arguments.

2) `exercises/error-handling.js`
   - Create a script that demonstrates graceful error handling with asynchronous file operations.
   - Validate CLI input before using it.
   - Use `try/catch`, promise rejection handlers, and `process.exitCode` for error states.

## Assessment

See `exercises/assessment.md` for quiz questions and additional assessment tasks.
