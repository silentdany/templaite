import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  gateway,
  streamText,
  type UIMessage,
} from "ai";
import { getAiChatResolution } from "@/lib/ai-chat-config";

export function GET() {
  const ai = getAiChatResolution();
  return Response.json({
    chatEnabled: ai.enabled,
    aiProvider: ai.provider,
  });
}

export async function POST(req: Request) {
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
