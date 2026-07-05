import { describe, expect, it } from "vitest";
import { greet } from "./greet.js";

describe("greet", () => {
  it("greets a named person", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it("falls back to a default when no name is given", () => {
    expect(greet()).toBe("Hello, there!");
  });

  it("trims surrounding whitespace from the name", () => {
    expect(greet("  Ada  ")).toBe("Hello, Ada!");
  });
});
