"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suggestedQuestions } from "@/data/chatbot";
import { cn } from "@/lib/utils";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi, I'm Ask David. I can answer questions about David's projects, skills, resume, coursework, and engineering interests."
  }
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("ask-david-chat");
    if (stored) setMessages(JSON.parse(stored) as Message[]);
  }, []);

  useEffect(() => {
    localStorage.setItem("ask-david-chat", JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function ask(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;
    const userMessage: Message = { role: "user", content: trimmedQuestion };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with ${response.status}`);
      }

      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ??
            "I can answer from David's portfolio data, but I couldn't find a specific answer for that question."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not reach the local chat endpoint. Try refreshing the page, and make sure the Next.js dev server is running."
        }
      ]);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  if (!mounted) return null;

  return (
    <div id="chatbot" className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div
        className={cn(
          "mb-2 w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-[2rem] border bg-card shadow-glow transition",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-10 place-items-center overflow-hidden">
              <Image
                src="/images/david-chibi.png"
                alt="Ask David assistant avatar"
                width={42}
                height={78}
                className="h-14 w-auto object-contain"
              />
            </span>
            <div>
              <h2 className="font-bold">Ask David</h2>
              <p className="text-xs text-muted-foreground">Portfolio knowledge assistant</p>
            </div>
          </div>
          <Button aria-label="Close chat" onClick={() => setOpen(false)} size="icon" variant="ghost">
            <X size={18} />
          </Button>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                className={cn(
                  "max-w-[86%] whitespace-pre-line rounded-xl px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                Thinking<span className="animate-pulse">...</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question) => (
              <button
                className="rounded-full border bg-background px-3 py-1 text-left text-xs text-muted-foreground transition hover:-rotate-1 hover:bg-muted"
                key={question}
                onClick={() => void ask(question)}
                suppressHydrationWarning
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={submit}>
          <input
            aria-label="Ask David a question"
            className="min-w-0 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about projects, skills, resume..."
            value={input}
          />
          <Button aria-label="Send question" disabled={loading} size="icon" type="submit">
            <Send size={18} />
          </Button>
        </form>
      </div>
      <button
        aria-label="Open Ask David chatbot"
        className="group relative grid justify-items-center border-0 bg-transparent p-0 text-left outline-none transition hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((current) => !current)}
        suppressHydrationWarning
      >
        <span className="mb-1 rounded-full border border-primary/25 bg-background/85 px-3 py-1 text-xs font-semibold text-primary shadow-glow backdrop-blur">
          Ask David
        </span>
        <Image
          src="/images/david-chibi.png"
          alt=""
          width={88}
          height={162}
          className="h-32 w-auto object-contain drop-shadow-[0_18px_22px_rgba(8,7,25,0.65)] transition group-hover:scale-105"
        />
      </button>
    </div>
  );
}
