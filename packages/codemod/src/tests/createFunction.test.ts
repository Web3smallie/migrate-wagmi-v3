import { transformCreateFunction } from "../transforms/createFunction";

describe("transformCreateFunction", () => {
  it("moves object literal trigger into options", () => {
    const input = `
inngest.createFunction(
  { id: "my-fn" },
  { event: "user/created" },
  async ({ event }) => {}
)`;

    const { code, changed } = transformCreateFunction(input);
    expect(changed).toBe(true);
    expect(code).toContain("triggers:");
    expect(code).not.toMatch(/\},\s*\{ event:/);
  });

  it("moves variable trigger into options", () => {
    const input = `
client.createFunction(
  { id: "my-fn", name: "My Fn" },
  triggerConfig,
  async (ctx) => {}
)`;

    const { code, changed } = transformCreateFunction(input);
    expect(changed).toBe(true);
    expect(code).toContain("triggers: [triggerConfig]");
  });

  it("skips already migrated code", () => {
    const input = `
inngest.createFunction(
  { id: "my-fn", triggers: [{ event: "user/created" }] },
  async ({ event }) => {}
)`;

    const { code, changed } = transformCreateFunction(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });

  it("does not produce double commas", () => {
    const input = `
inngest.createFunction(
  { id: "my-fn" },
  { event: "user/created" },
  async ({ event }) => {}
)`;

    const { code } = transformCreateFunction(input);
    expect(code).not.toContain(",,");
  });
});