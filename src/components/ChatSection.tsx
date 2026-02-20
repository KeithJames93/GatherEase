"use client";

import { useState, useRef, useEffect } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface ChatSectionProps {
  partyId: string;
}

export function ChatSection({ partyId }: ChatSectionProps) {
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !partyId) return null;
    return query(
      collection(firestore, "messages"),
      where("partyId", "==", partyId),
      orderBy("createdAt", "asc")
    );
  }, [firestore, partyId]);

  const { data: messages } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !firestore) return;

    const messagesCollection = collection(firestore, "messages");
    const newMessageRef = doc(messagesCollection);
    const messageData = {
      partyId,
      text: newMessage,
      sender: displayName || "Guest",
      createdAt: serverTimestamp(),
    };

    setDoc(newMessageRef, messageData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: newMessageRef.path,
          operation: 'create',
          requestResourceData: messageData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    setNewMessage("");
  };

  if (!hasSetUsername) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md border border-border flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <User className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Join the Conversation</h2>
          <p className="text-muted-foreground">Choose a temporary display name to chat with other guests.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(displayName.trim()) setHasSetUsername(true); }} className="w-full max-w-xs space-y-4">
          <Input
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 text-center"
            required
          />
          <Button type="submit" className="w-full h-12 font-headline font-bold">Start Chatting</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-border flex flex-col h-[600px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-accent text-white flex items-center gap-3">
        <MessageSquare className="w-5 h-5" />
        <h3 className="font-headline font-bold">Party Chat</h3>
        <span className="ml-auto text-xs opacity-75">Chatting as <b>{displayName}</b></span>
      </div>

      <ScrollArea className="flex-1 p-4 bg-secondary/10">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-2",
                msg.sender === displayName ? "ml-auto items-end" : "items-start"
              )}
            >
              <span className="text-[10px] font-bold text-muted-foreground mb-1 px-1">
                {msg.sender}
              </span>
              <div
                className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  msg.sender === displayName
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white text-foreground rounded-tl-none border border-border"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border flex gap-2">
        <Input
          placeholder="Say something nice..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 h-12 rounded-full"
        />
        <Button type="submit" size="icon" className="h-12 w-12 rounded-full shrink-0">
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
