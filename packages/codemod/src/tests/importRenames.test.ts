import { transformImportRenames } from "../transforms/importRenames";

describe("transformImportRenames", () => {
  it("updates useAccount import to useConnection", () => {
    const input = `import { useAccount } from "wagmi";`;
    const { code, changed } = transformImportRenames(input);
    expect(changed).toBe(true);
    expect(code).toContain("useConnection");
    expect(code).not.toContain("useAccount");
  });

  it("updates multiple imports at once", () => {
    const input = `import { useAccount, useAccountEffect, useSwitchAccount } from "wagmi";`;
    const { code, changed } = transformImportRenames(input);
    expect(changed).toBe(true);
    expect(code).toContain("useConnection");
    expect(code).toContain("useConnectionEffect");
    expect(code).toContain("useSwitchConnection");
  });

  it("skips non-wagmi imports", () => {
    const input = `import { useAccount } from "other-lib";`;
    const { code, changed } = transformImportRenames(input);
    expect(changed).toBe(false);
    expect(code).toBe(input);
  });
});