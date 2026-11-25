// Fortune Cookie for the Liquidated Trader — make.fun entry (program/v1, Node 22).
// Writes one fortune cookie line (at most 20 words, at most 160 characters)
// for a crypto trader who has just been liquidated, to /output/entry.txt.
// Deterministic: no network, no randomness, no environment input.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Your lucky numbers are the ones you sold to cover the margin call.";

const MAX_WORDS = 20;
const MAX_CHARS = 160;

const wordCount = LINE.split(/\s+/).filter(Boolean).length;
if (wordCount > MAX_WORDS) {
  throw new Error(`fortune is ${wordCount} words, over the ${MAX_WORDS}-word cap`);
}
if (LINE.length > MAX_CHARS) {
  throw new Error(`fortune is ${LINE.length} chars, over the ${MAX_CHARS}-char gate`);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  throw new Error("fortune must be one non-empty line of plain text");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Post-write verification: re-read the file and re-check the exact bytes
// that were written, so a truncated or altered write fails loudly instead
// of passing the gate checks above on the in-memory string alone.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("written entry.txt does not match the validated fortune");
}
if (written.split(/\s+/).filter(Boolean).length > MAX_WORDS || written.length > MAX_CHARS) {
  throw new Error("written entry.txt violates the word/char caps");
}
console.log(`wrote ${wordCount} words, ${LINE.length} chars to /output/entry.txt`);
