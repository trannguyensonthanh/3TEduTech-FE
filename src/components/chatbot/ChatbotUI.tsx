// src/components/chatbot/ChatbotUI.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../common/Icons';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area'; // Sử dụng ScrollArea của shadcn
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Sử dụng Avatar

interface Message {
  id: string | number; // ID nên là string để dùng uuid sau này
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotUIProps {
  lessonContext?: string; // Context của bài học hiện tại (ví dụ: "programming basics")
  initialMessages?: Message[]; // Cho phép truyền tin nhắn khởi tạo
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({
  lessonContext,
  initialMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultInitialMessage: Message = {
    id: 'init-bot-msg',
    text: `👋 Hi there! I'm your AI learning assistant for 3TEduTech. How can I help you with ${
      lessonContext ? `the lesson on "${lessonContext}"` : 'your learning'
    } today?`,
    sender: 'bot',
    timestamp: new Date(),
  };
  const [messages, setMessages] = useState<Message[]>(
    initialMessages || [defaultInitialMessage]
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref để scroll xuống cuối

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]); // Scroll xuống khi có tin nhắn mới

  const handleSendMessage = async () => {
    const trimmedInput = inputMessage.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`, // ID tạm thời
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate API call (GIỮ NGUYÊN LOGIC MOCK)
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 1000)
      ); // Thời gian bot "suy nghĩ" ngẫu nhiên hơn

      let botResponseText = '';
      const lowerInput = trimmedInput.toLowerCase();

      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponseText =
          'Hello! How can I assist you with your learning journey today?';
      } else if (lowerInput.includes('thank')) {
        botResponseText =
          "You're most welcome! Is there anything else I can clarify for you?";
      } else if (lessonContext) {
        if (
          lessonContext.toLowerCase().includes('python') &&
          (lowerInput.includes('loop') || lowerInput.includes('function'))
        ) {
          botResponseText = `Ah, regarding ${
            lowerInput.includes('loop') ? 'loops' : 'functions'
          } in Python for the lesson on "${lessonContext}", they are fundamental! Loops help you repeat tasks, and functions help you organize code. Any specific part you'd like to dive into?`;
        } else {
          botResponseText = `For the lesson on "${lessonContext}", that's an interesting question! I can explain the core concepts or provide some examples. What are you curious about?`;
        }
      } else {
        botResponseText =
          "That's a great question! While I don't have specific lesson context right now, I can try to help with general knowledge. Could you tell me more?";
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I encountered an issue trying to respond. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Gửi khi nhấn Enter (không phải Shift+Enter)
      e.preventDefault(); // Ngăn xuống dòng mặc định
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Nút mở chatbot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }} // Xuất hiện sau các element khác trên trang
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]" // z-index cao
      >
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-110 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              >
                <Icons.close className="h-7 w-7" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              >
                <Icons.chat className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Cửa sổ Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-[99] bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-[calc(100vw-3rem)] max-w-md flex flex-col h-[70vh] max-h-[550px] border dark:border-slate-700"
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 p-4 rounded-t-xl flex justify-between items-center border-b dark:border-slate-700">
              <div className="flex items-center">
                <Icons.bot className="h-6 w-6 mr-2.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-lg">
                  3TEdu AI Assistant
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <Icons.chevronDown className="h-5 w-5" />{' '}
                {/* Hoặc Icons.close */}
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/30 dark:bg-slate-800/30 custom-scrollbar">
              {' '}
              {/* custom-scrollbar từ globals.css */}
              <div className="space-y-5 pb-2">
                {' '}
                {/* Tăng space giữa các tin nhắn */}
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index < 3 ? index * 0.1 : 0,
                    }} // Animation cho vài tin nhắn đầu
                    className={`flex items-end gap-2.5 ${
                      message.sender === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-700 flex-shrink-0">
                        <AvatarImage src="/3telogo-icon.png" alt="AI Bot" />{' '}
                        {/* Icon logo nhỏ cho bot */}
                        <AvatarFallback>
                          <Icons.bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md text-sm leading-relaxed',
                        message.sender === 'user'
                          ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                      )}
                    >
                      {message.text}
                      <div
                        className={cn(
                          'text-xs mt-1.5 opacity-70',
                          message.sender === 'user'
                            ? 'text-blue-100 text-right'
                            : 'text-slate-500 dark:text-slate-400 text-left'
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 border-2 border-slate-300 dark:border-slate-600 flex-shrink-0">
                        {/* <AvatarImage src={currentUser?.avatarUrl} alt="User" />  Lấy avatar user nếu có */}
                        <AvatarFallback>
                          <Icons.userCircle2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2.5 justify-start"
                  >
                    <Avatar className="h-8 w-8 border-2 border-blue-200 dark:border-blue-700">
                      <AvatarImage src="/3telogo-icon.png" alt="AI Bot" />
                      <AvatarFallback>
                        <Icons.bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                      <div className="flex space-x-1.5 items-center h-3">
                        {' '}
                        {/* Căn giữa dots */}
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce_custom delay-0"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce_custom delay-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce_custom delay-400"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} /> {/* Để scroll */}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 sm:p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 rounded-b-xl">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 h-11"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-11 w-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={isTyping || !inputMessage.trim()}
                >
                  <Icons.send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                Press{' '}
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-sm dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  <Icons.enterKey className="inline h-2.5 w-2.5 mr-0.5" />
                  Enter
                </kbd>{' '}
                to send. Shift+Enter for new line.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotUI;
