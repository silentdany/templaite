"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatPanel() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const capability = useQuery({
    queryKey: ["chat-capability"],
    queryFn: async () => {
      const response = await fetch("/api/chat");
      return response.json() as Promise<{ chatEnabled: boolean }>;
    },
  });

  const chatEnabled = capability.data?.chatEnabled ?? false;
  const disabled =
    status === "streaming" || status === "submitted" || !chatEnabled;

  return (
    <div className="flex flex-1 flex-col min-h-0 max-w-2xl mx-auto w-full gap-4">
      <div>
        <h1 className="text-xl font-semibold">Chat</h1>
        {!chatEnabled ? (
          <p className="text-sm text-muted-foreground mt-1">
            Set <code className="text-xs">AI_GATEWAY_API_KEY</code> (Vercel AI
            Gateway) or <code className="text-xs">OPENAI_API_KEY</code> in{" "}
            <code className="text-xs">.env</code>. The UI stays up for layout
            checks.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Messages stream from <code className="text-xs">/api/chat</code>.
          </p>
        )}
      </div>

      <div className="flex-1 min-h-[240px] overflow-y-auto rounded-lg border border-border bg-card p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Send a message to start.</p>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <span className="font-medium text-muted-foreground">
              {message.role === "user" ? "You" : "Assistant"}
            </span>
            <div className="mt-1 whitespace-pre-wrap">
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null,
              )}
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const text = (data.get("message") as string)?.trim();
          if (!text || disabled) return;
          void sendMessage({ text });
          form.reset();
        }}
      >
        <Input
          name="message"
          placeholder={
            chatEnabled ? "Message…" : "Chat disabled until API key is set"
          }
          disabled={disabled}
          autoComplete="off"
        />
        <Button type="submit" disabled={disabled}>
          Send
        </Button>
      </form>
    </div>
  );
}
