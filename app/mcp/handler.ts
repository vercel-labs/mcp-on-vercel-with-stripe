import { z } from "zod";
import { initializeMcpApiHandler } from "../../lib/mcp-api-handler";
import { registerPaidTool } from "@stripe/agent-toolkit/modelcontextprotocol";
import dotenv from "dotenv";

dotenv.config();

export const mcpHandler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));

    registerPaidTool(
      server,
      "add_numbers",
      "Add two numbers together",
      {
        a: z.number(),
        b: z.number(),
      },
      ({ a, b }) => {
        return {
          content: [{ type: "text", text: `Result: ${a + b}` }],
        };
      },
      {
        priceId: "{{PRICE_ID}}",
        successUrl: "{{CALLBACK_URL}}",
        userEmail: "{{EMAIL}}",
        state: {
          stripe: {
            customerId: "{{CUSTOMER_ID}}",
            subscriptions: [],
            paidToolCalls: [],
            paidToolsToCheckoutSession: {},
          },
        },
        setState: (state) => {},
        paymentReason:
          "You must pay a subscription to add two big numbers together.",
        stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
      }
    );
  },

  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);

export default mcpHandler;
