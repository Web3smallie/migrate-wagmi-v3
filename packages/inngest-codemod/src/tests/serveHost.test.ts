import { transformServeHost } from "../transforms/serveHost";

describe("transformServeHost", () => {
  it("renames serveHost to serveOrigin", () => {
    const input = `serve({ client, functions, serveHost: "https://my-app.com" })`;
    const { code, changed } = transformServeHost(input);
    expect(changed).toBe(true);
    expect(code).toContain("serveOrigin");
    expect(code).not.toContain("serveHost");
  });

  it("renames INNGEST_SERVE_HOST env var", () => {
    const input = `// Set INNGEST_SERVE_HOST=https://my-app.com`;
    const { code, changed } = transformServeHost(input);
    expect(changed).toBe(true);
    expect(code).toContain("INNGEST_SERVE_ORIGIN");
    expect(code).not.toContain("INNGEST_SERVE_HOST");
  });

  it("skips files with no serveHost", () => {
    const input = `serve({ client, functions })`;
    const { code, changed } = transformServeHost(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});