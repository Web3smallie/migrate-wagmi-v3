"use client";

import { useState } from "react";

const PLACEHOLDER = `import { Inngest, EventSchemas } from "inngest";

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
  const [input, setInput] = useState(PLACEHOLDER);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [migrated, setMigrated] = useState(false);

  const handleMigrate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input }),
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
            migrate-inngest-v4
          </h1>
          <p className="text-gray-400 text-lg">
            Automatically migrate your Inngest TypeScript SDK from v3 to v4
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                v3 Code (Input)
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
                v4 Code (Output)
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
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
          >
            {loading ? "Migrating..." : "Migrate to v4"}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-4">{error}</div>
        )}

        <div className="text-center text-gray-500 text-sm">
          <p>
            Built for the Codemod Boring AI Hackathon
          </p>
        </div>
      </div>
    </main>
  );
}