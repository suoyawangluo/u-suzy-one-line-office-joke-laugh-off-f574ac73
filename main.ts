// One-Line Office Joke Laugh-Off — make.fun entry
// u-suzy-one-line-office-joke-laugh-off-f574ac73
//
// The entry: one original one-line office joke. The judge weighs, in order:
// 1. it really is a one-line office joke; 2. sharp, surprising punchline;
// 3. clear on one read; 4. fresh (no office cliches); 5. tight wording.
// Angle: the corporate-jargon twist — the same manager re-labels the same
// event depending on whose credit or blame it is. "Synergy" vs
// "accountability" is the joke: two buzzwords, one double standard.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

// The joke, built from named parts so each beat of the setup lands.
const SETUP = "My manager calls it 'synergy' when he takes credit for my work";
const PUNCH = "and 'accountability' when I take the blame for his.";
const ENTRY = `${SETUP} ${PUNCH}`;

interface GateReport {
  characters: number;
  lines: number;
  ok: boolean;
}

// Gate (from the kit): UTF-8 text, 1 to 200 characters, single line,
// not only white space.
function validateEntry(text: string): GateReport {
  const characters = [...text].length;
  const lines = text.split("\n").length;
  const ok =
    characters >= 1 &&
    characters <= 200 &&
    text.trim().length > 0 &&
    lines === 1;
  return { characters, lines, ok };
}

function buildEntry(): string {
  return ENTRY;
}

function verifyWritten(outPath: string, expected: string): string {
  const written = readFileSync(outPath, "utf8");
  if (written !== expected) throw new Error("round-trip mismatch");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildEntry();
  const report = validateEntry(entry);
  if (!report.ok) {
    throw new Error(
      `gate: ${report.characters} characters, ${report.lines} lines`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha = verifyWritten(outPath, entry);
  console.log(
    `gate passes: ${report.characters} characters, ${report.lines} line, sha256 ${sha}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
