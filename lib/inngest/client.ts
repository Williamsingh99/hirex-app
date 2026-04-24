import { Inngest } from "inngest";

// Initialize Inngest client
export const inngest = new Inngest({
  id: "hirex-ai-agent",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export default inngest;
