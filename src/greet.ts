/**
 * Build a friendly greeting.
 *
 * @param name - Who to greet. Whitespace is trimmed; falls back to "there".
 * @returns The greeting message.
 */
export function greet(name?: string): string {
  const who = name?.trim() || "there";
  return `Hello, ${who}!`;
}
