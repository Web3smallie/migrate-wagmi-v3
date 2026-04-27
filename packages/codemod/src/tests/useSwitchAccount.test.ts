import { transformUseSwitchAccount } from "../transforms/useSwitchAccount";

describe("transformUseSwitchAccount", () => {
  it("renames useSwitchAccount to useSwitchConnection", () => {
    const input = `const { switchAccount } = useSwitchAccount();`;
    const { code, changed } = transformUseSwitchAccount(input);
    expect(changed).toBe(true);
    expect(code).toContain("useSwitchConnection");
    expect(code).not.toContain("useSwitchAccount");
  });

  it("skips files with no useSwitchAccount", () => {
    const input = `const { address } = useAccount();`;
    const { code, changed } = transformUseSwitchAccount(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});