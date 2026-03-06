import React from 'react';
import Markdown from 'react-markdown';
import { cn } from '@/src/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-2xl shadow-sm",
        isUser 
          ? "bg-indigo-600 text-white rounded-tr-none" 
          : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none"
      )}>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown>{content}</Markdown>
        </div>
        {timestamp && (
          <div className={cn(
            "text-[10px] mt-1 opacity-50",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};
