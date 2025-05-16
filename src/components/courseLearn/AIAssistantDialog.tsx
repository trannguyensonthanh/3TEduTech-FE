// src/components/courseLearn/AIAssistantDialog.tsx
import React, {
  useState,
  FormEvent,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'; // DialogDescription không được dùng
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Avatar as ShadCNAvatar, // Renamed to avoid conflict if you have another Avatar component
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  SendHorizonal,
  Bot,
  UserCircle2,
  Loader2,
  X as XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarCanvas } from '@/components/ai-avatar/AvatarCanvas'; // Ensure this path is correct
import {
  speakText,
  getAvailableVoices,
  cancelSpeech,
} from '@/lib/ai/ttsService'; // Ensure this path and functions are correct
// import { useAskAIAssistant } from '@/hooks/queries/ai.queries'; // Uncomment when ready
import { motion } from 'framer-motion';
interface AIAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: {
    lessonId?: number | string | null;
    lessonName?: string | null;
    lessonContent?: string | null;
  }; // More specific context
  courseContext?: { courseId?: number | null; courseName?: string | null };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIAssistantDialog: React.FC<AIAssistantDialogProps> = ({
  isOpen,
  onClose,
  lessonContext,
  courseContext,
}) => {
  const contextWelcome = lessonContext?.lessonName
    ? `lesson "${lessonContext.lessonName}"`
    : 'this lesson';
  const initialWelcomeMessage = `Hi! I'm your AI Assistant for the ${contextWelcome}. How can I help you explore this topic further?`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAISpeakingViaTTS, setIsAISpeakingViaTTS] = useState(false);
  const [currentAvatarAnimation, setCurrentAvatarAnimation] = useState('Idle');

  const scrollAreaRef = useRef<HTMLDivElement>(null); // Type for ScrollArea's viewport div
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const { mutate: askAI, isPending: isCallingAPI } = useAskAIAssistant(); // Hook for actual AI API call

  const resetDialogState = useCallback(() => {
    setMessages([]);
    setInput('');
    setIsAILoading(false);
    setIsAISpeakingViaTTS(false);
    setCurrentAvatarAnimation('Idle');
    cancelSpeech(); // Stop any ongoing TTS
  }, []);

  // Handle initial welcome message and voice loading
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        // Only add welcome if no messages exist
        setMessages([
          {
            id: `ai-init-${Date.now()}`,
            sender: 'ai',
            text: initialWelcomeMessage,
            timestamp: new Date(),
          },
        ]);
        setCurrentAvatarAnimation('Salute');
        setTimeout(() => setCurrentAvatarAnimation('Idle'), 2500); // Return to Idle after salute
      }

      // Load TTS voices
      if (
        'speechSynthesis' in window &&
        window.speechSynthesis.onvoiceschanged !== undefined
      ) {
        const loadVoices = () => {
          getAvailableVoices(); // This function might populate a global list or just log
          console.log('Available TTS voices loaded.');
          window.speechSynthesis.removeEventListener(
            'voiceschanged',
            loadVoices
          );
        };
        if (getAvailableVoices().length === 0) {
          // Check if voices are already loaded
          window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        } else {
          loadVoices();
        }
        // Cleanup listener for voiceschanged
        return () => {
          window.speechSynthesis.removeEventListener(
            'voiceschanged',
            loadVoices
          );
        };
      }
    } else {
      // Optional: Reset state when dialog is fully closed, if desired
      // resetDialogState(); // Call this if you want a fresh start each time dialog opens
      cancelSpeech(); // Always cancel speech when dialog closes
    }
  }, [isOpen, initialWelcomeMessage, messages.length]); // messages.length to re-trigger if messages are cleared

  // Auto-scroll to latest message
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleDialogClose = () => {
    cancelSpeech(); // Ensure TTS stops
    setIsAISpeakingViaTTS(false);
    setCurrentAvatarAnimation('Idle');
    onClose(); // Call original onClose
    // resetDialogState(); // Uncomment if you want full reset on close
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const userText = input.trim();
    if (!userText || isAILoading || isAISpeakingViaTTS) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsAILoading(true);
    setCurrentAvatarAnimation('Nodding'); // Or 'Thinking'

    // --- TODO: Replace with actual API Call ---
    // askAI({ query: userText, lessonContext, courseContext }, {
    //   onSuccess: (aiResponseData) => {
    //     const aiText = aiResponseData.answer;
    //     setMessages(prev => [...prev, { id: `ai-api-${Date.now()}`, sender: 'ai', text: aiText, timestamp: new Date() }]);
    //     speakText(aiText,
    //       () => { setIsAISpeakingViaTTS(true); setCurrentAvatarAnimation("Talking"); },
    //       () => { setIsAISpeakingViaTTS(false); setCurrentAvatarAnimation("Idle"); }
    //     );
    //   },
    //   onError: (error: any) => {
    //     const errorMsg = "Sorry, I couldn't process that. Please try again or ask something different.";
    //     setMessages(prev => [...prev, { id: `ai-err-${Date.now()}`, sender: 'ai', text: errorMsg, timestamp: new Date() }]);
    //     setCurrentAvatarAnimation("Idle"); // Or an error/sad animation
    //   },
    //   onSettled: () => setIsAILoading(false)
    // });
    // --------------------------------------

    // --- Mock API Response (Current) ---
    console.log(
      'User asked:',
      userText,
      'Lesson Context:',
      lessonContext?.lessonName
    );
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1500)
    );
    const mockResponses = [
      `That's an excellent question regarding "${
        lessonContext?.lessonName || 'this topic'
      }"! Let me elaborate... The core concept here is often misunderstood, but if we look at it from the perspective of practical application, it becomes much clearer. For example, consider...`,
      `Considering "${userText}", for the lesson on "${
        lessonContext?.lessonName || 'this material'
      }", the key is to understand the underlying principles. Many learners find it helpful to relate this to real-world scenarios. Shall I provide an example related to ${
        courseContext?.courseName || 'this course'
      }?`,
      "I can certainly help with that. Let's break it down into smaller, more manageable parts. First, we need to identify... then, we analyze... and finally, we synthesize...",
      `Interesting thought! In the context of ${
        courseContext?.courseName || 'this course'
      }, we can see a direct application of this. This also ties into other lessons you might have encountered or will encounter soon.`,
      "I'm not sure I have the specific answer to that in my current knowledge base for this lesson, but I can try to provide some general information or point you to relevant resources if you'd like.",
    ];
    const aiResponseText =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-mock-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      },
    ]);
    setIsAILoading(false);

    speakText(
      aiResponseText,
      () => {
        setIsAISpeakingViaTTS(true);
        setCurrentAvatarAnimation('Talking');
      },
      () => {
        setIsAISpeakingViaTTS(false);
        setCurrentAvatarAnimation('Idle');
      }
    );
    // --- End Mock ---
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] xl:max-h-[85vh] w-[95vw] xl:w-[80vw] flex flex-col p-0 gap-0 shadow-2xl rounded-xl overflow-hidden">
        <DialogHeader className="p-3 sm:p-4 border-b sticky top-0 bg-background z-10 flex flex-row justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <DialogTitle className="text-base sm:text-lg font-semibold">
              AI Course Assistant
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDialogClose}
            className="h-8 w-8 rounded-full"
          >
            <XIcon size={18} /> <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {' '}
          {/* min-h-0 is crucial for flex child to not overflow */}
          <div className="w-1/2 md:w-2/5 lg:w-1/3 xl:w-2/5 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-0 relative overflow-hidden">
            <AvatarCanvas animationName={currentAvatarAnimation} />
            <div className="absolute bottom-2 left-2 right-2 text-center p-1.5 bg-black/40 rounded backdrop-blur-sm">
              <p className="text-xs text-slate-200 font-medium">
                {isAISpeakingViaTTS
                  ? 'Speaking...'
                  : isAILoading
                  ? 'Thinking...'
                  : 'Listening...'}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-background">
            <ScrollArea className="flex-grow p-3 sm:p-4" ref={scrollAreaRef}>
              {' '}
              {/* Pass ref to viewportRef if ScrollArea supports it, else to the main div */}
              <div className="space-y-4 mb-2">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    layout // Animate layout changes
                    initial={{ opacity: 0, y: msg.sender === 'user' ? 10 : 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay:
                        index === messages.length - 1 && msg.sender === 'ai'
                          ? 0.1
                          : 0,
                    }}
                    className={cn(
                      'flex items-end gap-2 max-w-[85%] sm:max-w-[75%]',
                      msg.sender === 'user'
                        ? 'ml-auto flex-row-reverse'
                        : 'mr-auto'
                    )}
                  >
                    <ShadCNAvatar
                      className={cn(
                        'h-7 w-7 sm:h-8 sm:w-8 border shadow-sm shrink-0',
                        msg.sender === 'user'
                          ? 'ml-1.5 sm:ml-2'
                          : 'mr-1.5 sm:mr-2'
                      )}
                    >
                      {/* <ShadCNAvatarImage src={msg.sender === 'ai' ? '/placeholder-ai-avatar.png' : user?.avatarUrl || undefined} /> */}
                      <AvatarFallback
                        className={cn(
                          msg.sender === 'ai'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted'
                        )}
                      >
                        {msg.sender === 'ai' ? (
                          <Bot size={16} />
                        ) : (
                          <UserCircle2 size={16} />
                        )}
                      </AvatarFallback>
                    </ShadCNAvatar>
                    <div
                      className={cn(
                        'p-2.5 sm:p-3 rounded-xl text-sm leading-relaxed shadow-md break-words',
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-card-foreground rounded-bl-none'
                      )}
                    >
                      {msg.text.split('\n').map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
                {isAILoading && !isAISpeakingViaTTS && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2 max-w-[85%] mr-auto"
                  >
                    <ShadCNAvatar className="h-7 w-7 sm:h-8 sm:w-8 border shadow-sm shrink-0 mr-1.5 sm:mr-2">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot size={16} />
                      </AvatarFallback>
                    </ShadCNAvatar>
                    <div className="p-3 rounded-xl text-sm bg-muted text-card-foreground rounded-bl-none shadow-md flex items-center space-x-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse delay-100"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse delay-200"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t bg-background shrink-0"
            >
              <div className="relative flex items-center">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about this lesson..."
                  className="pr-12 resize-none text-sm h-auto min-h-[44px] max-h-[120px] rounded-full py-2.5 px-4 focus-visible:ring-primary"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isAILoading || isAISpeakingViaTTS}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1.5 bottom-[5px] h-9 w-9 rounded-full text-primary hover:bg-primary/10 disabled:opacity-50"
                  disabled={!input.trim() || isAILoading || isAISpeakingViaTTS}
                  aria-label="Send message"
                >
                  <SendHorizonal size={20} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantDialog;
