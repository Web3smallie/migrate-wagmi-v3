import { transformLogLevel } from "../transforms/logLevel";

describe("transformLogLevel", () => {
  it("removes logLevel and adds TODO comment", () => {
    const input = `const inngest = new Inngest({ id: "my-app", logLevel: "debug" })`;
    const { code, changed } = transformLogLevel(input);
    expect(changed).toBe(true);
    expect(code).not.toContain("logLevel:");
    expect(code).toContain("TODO (AI)");
    expect(code).toContain("ConsoleLogger");
  });

  it("skips files with no logLevel", () => {
    const input = `const inngest = new Inngest({ id: "my-app" })`;
    const { code, changed } = transformLogLevel(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});