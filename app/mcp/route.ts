import { createServerResponseAdapter } from "../../lib/server-response-handler";
import { mcpHandler } from "./handler";

export const MAX_DURATION = 60;

const handler = (req: Request) => {
  return createServerResponseAdapter(req.signal, (res) => {
    mcpHandler(req, res);
  });
};

export { handler as GET };
export { handler as POST };
export { handler as DELETE };
