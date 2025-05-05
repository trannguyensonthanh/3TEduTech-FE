import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { AvatarCanvas } from "@/components/ai-avatar/AvatarCanvas";

export interface AI3DAssistantProps {
  message?: string;
  initialMessage?: string;
  isOpen?: boolean;
  onClose?: () => void;
  lessonContext?: string;
}

const AI3DAssistant: React.FC<AI3DAssistantProps> = ({
  message,
  initialMessage,
  isOpen = true,
  onClose,
  lessonContext,
}) => {
  // Use initialMessage if provided, otherwise use message, or fall back to the default
  const contextPrefix = lessonContext
    ? `Based on the lesson about ${lessonContext}: `
    : "";
  const firstMessage =
    initialMessage ||
    message ||
    `${contextPrefix}Hello! How can I assist you today?`;

  const [messages, setMessages] = useState([
    { role: "assistant", content: firstMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me explain...",
        "I can help you with that. Here's what you need to know...",
        "Based on the course content, I'd recommend focusing on...",
        "Let me break this down for you step by step...",
        "That's an interesting point. Have you considered...",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: randomResponse },
      ]);
      setIsLoading(false);
    }, 1000);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col h-[82vh]">
      <ScrollArea className="p-4">
        <div className="space-y-4 ">
          {/* {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className={`h-8 w-8 ${
                    message.role === "user" ? "ml-2" : "mr-2"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/ai-assistant.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%]">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 text-sm bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )} */}
          {/* AI 3D Avatar */}
          <div style={{ width: "500px", borderLeft: "1px solid #ccc" }}>
            <AvatarCanvas />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex-1">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about the course..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AI3DAssistant;
