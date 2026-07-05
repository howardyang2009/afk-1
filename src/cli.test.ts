import { describe, expect, it } from "vitest";
import { buildProgram } from "./cli.js";

/** Run the program against argv and capture what it writes to stdout. */
function run(args: string[]): string {
  let out = "";
  const program = buildProgram((line) => {
    out += `${line}\n`;
  });
  program.exitOverride();
  program.configureOutput({ writeOut: (s) => (out += s) });
  program.parse(args, { from: "user" });
  return out;
}

describe("cli", () => {
  it("greets with the provided name", () => {
    expect(run(["greet", "Ada"])).toContain("Hello, Ada!");
  });

  it("greets with the default when no name is passed", () => {
    expect(run(["greet"])).toContain("Hello, there!");
  });

  it("exposes a program name and version", () => {
    const program = buildProgram(() => {});
    expect(program.name()).toBe("afk");
    expect(program.version()).toBeTruthy();
  });
});
