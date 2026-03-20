export type AiChatProvider = "gateway" | "openai" | "none";

export interface AiChatResolution {
  enabled: boolean;
  provider: AiChatProvider;
  /** Gateway model id, e.g. `openai/gpt-4o-mini` — only used when provider is `gateway`. */
  gatewayModelId: string;
  /** OpenAI SDK model id — only used when provider is `openai`. */
  openaiModelId: string;
}

export function getAiChatResolution(): AiChatResolution {
  const gatewayModelId =
    process.env.AI_GATEWAY_MODEL?.trim() || "openai/gpt-4o-mini";
  const openaiModelId =
    process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

  if (process.env.AI_GATEWAY_API_KEY) {
    return {
      enabled: true,
      provider: "gateway",
      gatewayModelId,
      openaiModelId,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      enabled: true,
      provider: "openai",
      gatewayModelId,
      openaiModelId,
    };
  }

  return {
    enabled: false,
    provider: "none",
    gatewayModelId,
    openaiModelId,
  };
}
