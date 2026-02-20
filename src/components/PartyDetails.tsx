"use client";

import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartyDetailsProps {
  party: {
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
  };
}

export function PartyDetails({ party }: PartyDetailsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: party.name,
        text: `You're invited to ${party.name}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-border space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full shrink-0">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Date</p>
            <p className="font-headline font-bold text-lg">{party.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full shrink-0">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Time</p>
            <p className="font-headline font-bold text-lg">{party.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">Location</p>
            <p className="font-headline font-bold text-lg">{party.location}</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="font-headline font-bold text-2xl mb-4 text-foreground">About the Party</h3>
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-lg">
          {party.description || "No description provided."}
        </p>
      </div>

      <div className="pt-6 flex justify-center">
        <Button onClick={handleShare} variant="outline" className="rounded-full px-8 py-6 h-auto text-lg gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
          <Share2 className="w-5 h-5" /> Share this Event
        </Button>
      </div>
    </div>
  );
}
