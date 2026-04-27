/* TODO (AI): Remove EventSchemas import and replace with eventType, staticSchema */
import { Inngest, EventSchemas } from "inngest";

const inngest = new Inngest({
  id: "my-app" /* TODO (AI): logLevel removed in v4. Replace with: logger: new ConsoleLogger({ level: "debug" }) — import ConsoleLogger from "inngest" */
  schemas: /* TODO (AI): EventSchemas removed in v4. Migrate to eventType() or staticSchema().
       * See: https://www.inngest.com/docs/reference/typescript/v4/migrations/v3-to-v4
       * Example:
       *   const userCreated = eventType("user/created", {
       *     schema: staticSchema<{ userId: string; email: string }>()
       *   });
       */ new EventSchemas().fromRecord<{
    "user/created": { data: { userId: string; email: string } };
  }>(),
});

export const userCreated = inngest.createFunction(
  { id: "on-user-created", triggers: [{ event: "user/created" }]}, async ({ event, step }) => {
    await step.run("send-email", async () => {
      console.log("sending email to", event.data.email);
    });

    await step.invoke("notify-admin", {
      function: "my-app-notify-fn",
      data: { userId: event.data.userId },
    });
  }
);

export const handler = /* TODO (AI): Move signingKey, baseUrl, fetch, signingKeyFallback from serve() to new Inngest({...}) constructor */
    serve({
  client: inngest,
  functions: [userCreated],
  signingKey: "my-signing-key",
  serveOrigin: "https://my-app.com",
  streaming: true,
});