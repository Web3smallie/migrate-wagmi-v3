import { NextRequest, NextResponse } from "next/server";
import { transformCreateFunction } from "../../../../../packages/inngest-codemod/src/transforms/createFunction";
import { transformServeOptions } from "../../../../../packages/inngest-codemod/src/transforms/serveOptions";
import { transformServeHost } from "../../../../../packages/inngest-codemod/src/transforms/serveHost";
import { transformStreaming } from "../../../../../packages/inngest-codemod/src/transforms/streaming";
import { transformLogLevel } from "../../../../../packages/inngest-codemod/src/transforms/logLevel";
import { transformEventSchemas } from "../../../../../packages/inngest-codemod/src/transforms/eventSchemas";
import { transformUseAccount } from "../../../../../packages/codemod/src/transforms/useAccount";
import { transformUseAccountEffect } from "../../../../../packages/codemod/src/transforms/useAccountEffect";
import { transformUseSwitchAccount } from "../../../../../packages/codemod/src/transforms/useSwitchAccount";
import { transformMutateRename } from "../../../../../packages/codemod/src/transforms/mutateRename";
import { transformWagmiProvider } from "../../../../../packages/codemod/src/transforms/wagmiProvider";
import { transformImportRenames } from "../../../../../packages/codemod/src/transforms/importRenames";
import { transformHookRenames } from "../../../../../packages/codemod/src/transforms/hookRenames";

export async function POST(req: NextRequest) {
  try {
    const { code, ecosystem } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let transformed = code;

    if (ecosystem === "inngest") {
      transformed = transformCreateFunction(transformed).code;
      transformed = transformServeOptions(transformed).code;
      transformed = transformServeHost(transformed).code;
      transformed = transformStreaming(transformed).code;
      transformed = transformLogLevel(transformed).code;
      transformed = transformEventSchemas(transformed).code;
    } else {
      // wagmi (default)
      transformed = transformHookRenames(transformed).code;
      transformed = transformUseAccount(transformed).code;
      transformed = transformUseAccountEffect(transformed).code;
      transformed = transformUseSwitchAccount(transformed).code;
      transformed = transformMutateRename(transformed).code;
      transformed = transformWagmiProvider(transformed).code;
      transformed = transformImportRenames(transformed).code;
    }

    return NextResponse.json({ output: transformed });
  } catch (error) {
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}