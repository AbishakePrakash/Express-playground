import fs from "fs";
import { basename } from "path";

// Function to get the current time formatted as desired
function getCurrentTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  return `${date} ${time}`;
}

// Custom log function
export default function Logger(...args) {
  // Get the stack trace and extract the caller file and line number

  const colorReset = "\x1b[0m";
  const colorTime = "\x1b[36m";
  const colorPath = "\x1b[35m";

  const stack = new Error().stack.split("\n")[2];
  const match = stack.match(/\((.*):(\d+):\d+\)/);
  if (match) {
    const filePath = match[1];
    const lineNumber = match[2];
    const fileName = basename(filePath);
    const logMessage = `${colorTime}${getCurrentTime()}${colorReset} ${colorPath}${fileName}_ln${lineNumber}:${colorReset}`;
    console.log(logMessage, ...args);
  } else {
    console.log(message);
  }
}
