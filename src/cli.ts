import { Command } from "commander";
import { greet } from "./greet.js";

/** Sink for CLI output; injectable so commands stay testable. */
export type Writer = (line: string) => void;

/**
 * Build the CLI program.
 *
 * @param write - Where command output is written (defaults to console.log).
 * @returns A configured Commander program, ready to `.parse()`.
 */
export function buildProgram(write: Writer = console.log): Command {
  const program = new Command();

  program
    .name("afk")
    .description("A basic TypeScript CLI template")
    .version("0.1.0");

  program
    .command("greet")
    .description("Print a friendly greeting")
    .argument("[name]", "who to greet")
    .action((name?: string) => {
      write(greet(name));
    });

  return program;
}
