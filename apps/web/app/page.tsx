"use client";

import { useState } from "react";

const WAGMI_PLACEHOLDER = `import { useAccount, useAccountEffect, useSwitchAccount } from "wagmi";
import { injected } from "@wagmi/connectors";

export function WalletStatus() {
  const { address, status } = useAccount();

  useAccountEffect({
    onConnect(data) {
      console.log("Connected!", data);
    },
  });

  const { switchAccount } = useSwitchAccount();

  return (
    <div>
      <p>Address: {address}</p>
      <button onClick={() => switchAccount({ connector: injected() })}>
        Switch Account
      </button>
    </div>
  );
}`;

const INNGEST_PLACEHOLDER = `import { Inngest, EventSchemas } from "inngest";

const inngest = new Inngest({
  id: "my-app",
  logLevel: "debug",
  schemas: new EventSchemas().fromRecord(),
});

export const userCreated = inngest.createFunction(
  { id: "on-user-created" },
  { event: "user/created" },
  async ({ event, step }) => {
    await step.run("send-email", async () => {
      console.log(event.data.userId);
    });
  }
);`;

export default function Home() {
  const [ecosystem, setEcosystem] = useState<"wagmi" | "inngest">("wagmi");
  const [input, setInput] = useState(WAGMI_PLACEHOLDER);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [migrated, setMigrated] = useState(false);

  const handleEcosystemChange = (eco: "wagmi" | "inngest") => {
    setEcosystem(eco);
    setInput(eco === "wagmi" ? WAGMI_PLACEHOLDER : INNGEST_PLACEHOLDER);
    setOutput("");
    setMigrated(false);
    setError("");
  };

  const handleMigrate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input, ecosystem }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output);
        setMigrated(true);
      }
    } catch (e) {
      setError("Migration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Boring AI Migration Suite
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Automated codemod for wagmi v2→v3 and Inngest v3→v4
          </p>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => handleEcosystemChange("wagmi")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                ecosystem === "wagmi"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              wagmi v2 → v3
            </button>
            <button
              onClick={() => handleEcosystemChange("inngest")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                ecosystem === "inngest"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Inngest v3 → v4
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {ecosystem === "wagmi" ? "v2 Code (Input)" : "v3 Code (Input)"}
              </span>
            </div>
            <textarea
              className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setMigrated(false);
                setOutput("");
              }}
              spellCheck={false}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {ecosystem === "wagmi" ? "v3 Code (Output)" : "v4 Code (Output)"}
              </span>
              {migrated && (
                <span className="text-xs text-green-400 font-medium">
                  Migration complete
                </span>
              )}
            </div>
            <textarea
              className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-100 resize-none"
              value={output || "// Output will appear here after migration..."}
              readOnly
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleMigrate}
            disabled={loading}
            className={`px-8 py-3 ${
              ecosystem === "wagmi" ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800" : "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800"
            } disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors`}
          >
            {loading ? "Migrating..." : `Migrate to ${ecosystem === "wagmi" ? "v3" : "v4"}`}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-4">{error}</div>
        )}

        <div className="text-center text-gray-500 text-sm">
          <p>Built for the Codemod Boring AI Hackathon 2026</p>
          <p className="mt-1">
            <a href="https://github.com/Web3smallie/migrate-wagmi-v3" className="text-blue-400 hover:underline">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}