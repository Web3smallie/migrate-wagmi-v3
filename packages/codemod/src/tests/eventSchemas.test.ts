import { transformEventSchemas } from "../transforms/eventSchemas";

describe("transformEventSchemas", () => {
  it("flags EventSchemas usage with TODO comment", () => {
    const input = `
import { Inngest, EventSchemas } from "inngest";
const inngest = new Inngest({
  id: "my-app",
  schemas: new EventSchemas().fromRecord<{}>(),
});`;
    const { code, changed } = transformEventSchemas(input);
    expect(changed).toBe(true);
    expect(code).toContain("TODO (AI)");
    expect(code).toContain("eventType()");
  });

  it("skips files with no EventSchemas", () => {
    const input = `const inngest = new Inngest({ id: "my-app" })`;
    const { code, changed } = transformEventSchemas(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});