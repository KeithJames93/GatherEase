"use client";

import { use, useState, useEffect } from "react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { PartyDetails } from "@/components/PartyDetails";
import { RSVPSection } from "@/components/RSVPSection";
import { ChatSection } from "@/components/ChatSection";
import { AIBrainstormer } from "@/components/AIBrainstormer";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, Sparkles, UserPlus, Share2, Copy, Check, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const partyRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "parties", id);
  }, [firestore, id]);

  const { data: party, isLoading: loading } = useDoc(partyRef);

  const handleCopyLink = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Ready to share with your friends.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-12 px-4 space-y-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="p-6 bg-accent/10 rounded-full mb-6">
          <Share2 className="w-16 h-16 text-accent" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-foreground mb-4">Party Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">This party link might have expired or it was never created. Want to start a new one?</p>
        <Button asChild>
          <a href="/#plan">Start Planning</a>
        </Button>
      </div>
    );
  }

  const partyWithId = { ...party, id };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary pt-12 pb-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 rotate-12"><Calendar size={120} /></div>
          <div className="absolute bottom-10 right-10 -rotate-12"><MapPin size={120} /></div>
        </div>
        <div className="container max-w-4xl relative z-10">
          <Badge variant="outline" className="mb-4 text-white border-white/40 bg-white/10 px-4 py-1">You're Invited!</Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-sm">{party.name}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-sm">{party.description}</p>
        </div>
      </div>

      <div className="container max-w-6xl px-4 -mt-16">
        <Tabs defaultValue="details" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/90 backdrop-blur shadow-xl border border-border p-1 h-auto flex flex-wrap justify-center rounded-2xl">
              <TabsTrigger value="details" className="px-6 py-3 rounded-xl text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 transition-all">
                <Calendar className="w-4 h-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="rsvp" className="px-6 py-3 rounded-xl text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 transition-all">
                <UserPlus className="w-4 h-4" /> Guest List
              </TabsTrigger>
              <TabsTrigger value="chat" className="px-6 py-3 rounded-xl text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 transition-all">
                <MessageCircle className="w-4 h-4" /> Chat
              </TabsTrigger>
              <TabsTrigger value="brainstorm" className="px-6 py-3 rounded-xl text-base data-[state=active]:bg-accent data-[state=active]:text-white flex items-center gap-2 transition-all">
                <Sparkles className="w-4 h-4" /> AI Ideas
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <TabsContent value="details" className="mt-0 outline-none">
                <PartyDetails party={partyWithId} />
              </TabsContent>
              <TabsContent value="rsvp" className="mt-0 outline-none">
                <RSVPSection partyId={id} />
              </TabsContent>
              <TabsContent value="chat" className="mt-0 outline-none">
                <ChatSection partyId={id} />
              </TabsContent>
              <TabsContent value="brainstorm" className="mt-0 outline-none">
                <AIBrainstormer party={partyWithId} />
              </TabsContent>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-border group">
                <h3 className="font-headline font-bold text-xl mb-4 text-accent flex items-center gap-2">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Invite Guests
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Share this magic link with anyone you want to invite:</p>
                  <div className="flex gap-2">
                    <Input 
                      value={currentUrl} 
                      readOnly 
                      className="bg-muted font-mono text-xs h-10 border-dashed"
                    />
                    <Button size="icon" variant="outline" onClick={handleCopyLink} className="shrink-0 hover:bg-accent/10 hover:border-accent">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleCopyLink} className="w-full gap-2 bg-accent hover:bg-accent/90">
                      <Copy className="w-4 h-4" /> Copy Invitation Link
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-accent text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
                <h3 className="font-headline font-bold text-xl mb-3 flex items-center gap-2">
                   Host Toolkit
                </h3>
                <ul className="text-sm space-y-3 opacity-90 relative z-10">
                  <li className="flex gap-2">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span>Guests can RSVP instantly without creating an account.</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span>Use the Chat tab to coordinate what people should bring.</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span>Try the AI tab for unique theme and cocktail names!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
