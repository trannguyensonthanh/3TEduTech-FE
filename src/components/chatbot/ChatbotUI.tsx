
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from '../common/Icons';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotUIProps {
  lessonContext?: string;
}

const ChatbotUI = ({ lessonContext }: ChatbotUIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm your AI learning assistant. Ask me anything about this lesson, and I'll help you understand the concepts better!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate API call to get bot response
    try {
      // In a real application, this would be an API call to your AI backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample responses based on context
      let botResponse = '';
      
      if (inputMessage.toLowerCase().includes('hello') || inputMessage.toLowerCase().includes('hi')) {
        botResponse = "Hello! How can I help you with this lesson today?";
      } else if (inputMessage.toLowerCase().includes('thank')) {
        botResponse = "You're welcome! Feel free to ask if you need more help.";
      } else if (lessonContext && lessonContext.includes('programming')) {
        botResponse = "Based on this programming lesson, I'd recommend practicing with the code examples provided. Would you like me to explain any specific concept in more detail?";
      } else if (lessonContext && lessonContext.includes('data science')) {
        botResponse = "This data science concept can be complex. Let me break it down for you: it involves analyzing data patterns to make predictions. What specific aspect are you struggling with?";
      } else {
        botResponse = "That's a great question! Based on the lesson material, I'd suggest focusing on the key concepts outlined in section 2. Would you like me to elaborate on any specific point?";
      }
      
      // Add bot response
      const botMessageObj: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessageObj]);
    } catch (error) {
      console.error('Error getting bot response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-96 transition-all">
          <div className="bg-brand-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <Icons.chat className="h-5 w-5 mr-2" />
              <span className="font-medium">AI Learning Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-brand-400" 
              onClick={() => setIsOpen(false)}
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-brand-100 text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-lg bg-brand-500 hover:bg-brand-600"
        >
          <Icons.chat className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatbotUI;
