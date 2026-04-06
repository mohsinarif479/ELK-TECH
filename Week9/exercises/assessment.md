# Week 9 Assessment

## Scenario-Based Quiz

1. Describe the Node.js event loop phases and explain where `setTimeout`, promises, and I/O callbacks are processed.
2. What is the difference between synchronous and asynchronous file system operations in Node.js?
3. Why are streams preferred for reading large files instead of `fs.readFileSync` or `fs.readFile`?
4. How can you handle errors from an async function that uses `await`?

## Practical Assessment

1. Extend `word-frequency.js` to support:
   - ignoring a set of stop words
   - returning the top 20 most frequent words
   - accepting a `--min-length` flag for word length filtering

2. Add more robust error handling to `error-handling.js`:
   - validate that the provided path is a file
   - print a clear message when the file path points to a directory
   - use a non-zero exit code for any failure

3. Create a third script that reads a CSV or log file, parses each line, and prints a summary report using streams.
