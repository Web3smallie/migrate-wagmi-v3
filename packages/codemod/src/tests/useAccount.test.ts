import { transformUseAccount } from "../transforms/useAccount";

describe("transformUseAccount", () => {
  it("renames useAccount to useConnection", () => {
    const input = `const { address } = useAccount();`;
    const { code, changed } = transformUseAccount(input);
    expect(changed).toBe(true);
    expect(code).toContain("useConnection");
    expect(code).not.toContain("useAccount");
  });

  it("does not rename useAccountEffect", () => {
    const input = `useAccountEffect({ onConnect() {} });`;
    const { code, changed } = transformUseAccount(input);
    expect(changed).toBe(false);
    expect(code).toContain("useAccountEffect");
  });

  it("skips already migrated code", () => {
    const input = `const { address } = useConnection();`;
    const { code, changed } = transformUseAccount(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});