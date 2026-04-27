import { transformUseAccountEffect } from "../transforms/useAccountEffect";

describe("transformUseAccountEffect", () => {
  it("renames useAccountEffect to useConnectionEffect", () => {
    const input = `useAccountEffect({ onConnect() {} });`;
    const { code, changed } = transformUseAccountEffect(input);
    expect(changed).toBe(true);
    expect(code).toContain("useConnectionEffect");
    expect(code).not.toContain("useAccountEffect");
  });

  it("skips files with no useAccountEffect", () => {
    const input = `const { address } = useAccount();`;
    const { code, changed } = transformUseAccountEffect(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});