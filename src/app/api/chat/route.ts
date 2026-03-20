import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  gateway,
  streamText,
  type UIMessage,
} from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAiChatResolution } from "@/lib/ai-chat-config";
import { consumeChatRateLimit } from "@/lib/chat-rate-limit";

export function GET() {
  const ai = getAiChatResolution();
  return Response.json({
    chatEnabled: ai.enabled,
    aiProvider: ai.provider,
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!consumeChatRateLimit(session.user.id)) {
    return Response.json(
      { error: "Too many chat requests. Try again in a minute." },
      { status: 429 },
    );
  }

  const ai = getAiChatResolution();

  if (!ai.enabled) {
    return Response.json(
      {
        error:
          "No AI credentials: set AI_GATEWAY_API_KEY (Vercel AI Gateway) or OPENAI_API_KEY.",
      },
      { status: 503 },
    );
  }

  const body: { messages: UIMessage[] } = await req.json();

  const model =
    ai.provider === "gateway"
      ? gateway(ai.gatewayModelId)
      : openai(ai.openaiModelId);

  const result = streamText({
    model,
    messages: await convertToModelMessages(body.messages),
  });

  return result.toUIMessageStreamResponse();
}
