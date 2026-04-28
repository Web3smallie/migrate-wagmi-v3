import { transformStreaming } from "../transforms/streaming";

describe("transformStreaming", () => {
  it('replaces streaming: "force" with streaming: true', () => {
    const input = `serve({ client, functions, streaming: "force" })`;
    const { code, changed } = transformStreaming(input);
    expect(changed).toBe(true);
    expect(code).toContain("streaming: true");
    expect(code).not.toContain('"force"');
  });

  it('replaces streaming: "allow" with streaming: true', () => {
    const input = `serve({ client, functions, streaming: "allow" })`;
    const { code, changed } = transformStreaming(input);
    expect(changed).toBe(true);
    expect(code).toContain("streaming: true");
    expect(code).not.toContain('"allow"');
  });

  it("skips streaming: false", () => {
    const input = `serve({ client, functions, streaming: false })`;
    const { code, changed } = transformStreaming(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });

  it("skips if no streaming option", () => {
    const input = `serve({ client, functions })`;
    const { code, changed } = transformStreaming(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});