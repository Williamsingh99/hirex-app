// @ts-nocheck
export const dynamic = 'force-dynamic';
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { applyToJob } from "@/lib/automation/applyAgent";

// Define the autonomous application function as an Inngest background job
// @ts-nocheck
const autonomousApply = inngest.createFunction(
  {
    id: "autonomous-apply",
    name: "Autonomous Job Application",
    event: "job.apply.requested"
  },
  async ({ event, step }) => {
      const { userId, matchId } = event.data;

      // Wrap the heavy automation in a step to allow retries and avoid timeouts
      const result = await step.run("run-automation", async () => {
        return await applyToJob(userId, matchId);
      });

      return { result };
    }
  );

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [autonomousApply],
});
