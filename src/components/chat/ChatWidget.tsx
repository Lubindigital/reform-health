"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          style={{ width: "min(260px, calc(100vw - 3rem))" }}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:!w-[315px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-navy px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-heading">
                  ReForm Assistant
                </p>
                <p className="text-xs text-white/70">Ask us anything</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-[260px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:h-[285px]">
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/10">
                  <MessageCircle className="h-6 w-6 text-navy" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  How can we help?
                </p>
                <p className="max-w-[260px] text-xs text-muted-foreground">
                  Ask about our mission, membership, initiatives, or how we can
                  help your organization.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-navy text-white"
                      : "rounded-bl-md bg-muted text-foreground"
                  }`}
                >
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map((part, i) => (
                      <span key={i}>{part.text}</span>
                    ))}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lg transition-all hover:bg-navy-deep hover:shadow-xl active:scale-95"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
