"use client";

import { use } from "react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { PartyDetails } from "@/components/PartyDetails";
import { RSVPSection } from "@/components/RSVPSection";
import { ChatSection } from "@/components/ChatSection";
import { AIBrainstormer } from "@/components/AIBrainstormer";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageCircle, Sparkles, UserPlus } from "lucide-react";

export default function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();

  const partyRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "parties", id);
  }, [firestore, id]);

  const { data: party, loading } = useDoc(partyRef);

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
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-headline font-bold text-accent mb-4">Party Not Found!</h1>
        <p className="text-muted-foreground">It seems this party link is invalid or has expired.</p>
      </div>
    );
  }

  const partyWithId = { ...party, id };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary pt-12 pb-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 rotate-12"><Calendar size={120} /></div>
          <div className="absolute bottom-10 right-10 -rotate-12"><MessageCircle size={120} /></div>
        </div>
        <div className="container max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">{party.name}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{party.description}</p>
        </div>
      </div>

      <div className="container max-w-6xl px-4 -mt-16">
        <Tabs defaultValue="details" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/80 backdrop-blur shadow-lg border border-border p-1 h-auto flex flex-wrap justify-center">
              <TabsTrigger value="details" className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="rsvp" className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> RSVPs
              </TabsTrigger>
              <TabsTrigger value="chat" className="px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Guest Chat
              </TabsTrigger>
              <TabsTrigger value="brainstorm" className="px-6 py-3 text-base data-[state=active]:bg-accent data-[state=active]:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Brainstorm
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <TabsContent value="details" className="mt-0">
                <PartyDetails party={partyWithId} />
              </TabsContent>
              <TabsContent value="rsvp" className="mt-0">
                <RSVPSection partyId={id} />
              </TabsContent>
              <TabsContent value="chat" className="mt-0">
                <ChatSection partyId={id} />
              </TabsContent>
              <TabsContent value="brainstorm" className="mt-0">
                <AIBrainstormer party={partyWithId} />
              </TabsContent>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-border">
                <h3 className="font-headline font-bold text-xl mb-4 text-accent">Quick Links</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}>
                    {typeof window !== 'undefined' ? window.location.href : ''}
                  </div>
                  <p className="text-xs text-muted-foreground">Share this URL with your guests. No login required!</p>
                </div>
              </div>
              <div className="bg-accent text-white p-6 rounded-2xl shadow-md">
                <h3 className="font-headline font-bold text-xl mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Tips for Hosts
                </h3>
                <ul className="text-sm space-y-2 opacity-90 list-disc list-inside">
                  <li>Keep descriptions fun and engaging.</li>
                  <li>Use the AI tool for theme ideas.</li>
                  <li>Check the chat regularly for questions.</li>
                  <li>Remind guests to RSVP by sharing the link.</li>
                </ul>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
