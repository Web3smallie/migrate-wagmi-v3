import { NextRequest, NextResponse } from "next/server";
import { transformCreateFunction } from "../../../../../packages/codemod/src/transforms/createFunction";
import { transformServeOptions } from "../../../../../packages/codemod/src/transforms/serveOptions";
import { transformServeHost } from "../../../../../packages/codemod/src/transforms/serveHost";
import { transformStreaming } from "../../../../../packages/codemod/src/transforms/streaming";
import { transformLogLevel } from "../../../../../packages/codemod/src/transforms/logLevel";
import { transformEventSchemas } from "../../../../../packages/codemod/src/transforms/eventSchemas";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let transformed = code;

    transformed = transformCreateFunction(transformed).code;
    transformed = transformServeOptions(transformed).code;
    transformed = transformServeHost(transformed).code;
    transformed = transformStreaming(transformed).code;
    transformed = transformLogLevel(transformed).code;
    transformed = transformEventSchemas(transformed).code;

    return NextResponse.json({ output: transformed });
  } catch (error) {
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}