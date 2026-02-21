"use client";

import { useState, useMemo } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, serverTimestamp, doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, CheckCircle2, Loader2 } from "lucide-react";

interface RSVPSectionProps {
  partyId: string;
}

export function RSVPSection({ partyId }: RSVPSectionProps) {
  const firestore = useFirestore();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Correctly memoized query
  const rsvpsQuery = useMemoFirebase(() => {
    if (!firestore || !partyId) return null;
    return query(
      collection(firestore, "rsvps"),
      where("partyId", "==", partyId)
    );
  }, [firestore, partyId]);

  const { data: rsvps, isLoading: loading } = useCollection(rsvpsQuery);

  // Client-side sorting for immediate results
  const sortedRSVPs = useMemo(() => {
    if (!rsvps) return [];
    return [...rsvps].sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
  }, [rsvps]);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !firestore) return;

    setSubmitting(true);
    const rsvpsCollection = collection(firestore, "rsvps");
    const newRSVPRef = doc(rsvpsCollection);
    const rsvpData = {
      partyId,
      name,
      createdAt: serverTimestamp(),
    };

    // Non-blocking update
    setDocumentNonBlocking(newRSVPRef, rsvpData, { merge: true });
    
    setName("");
    // Give a brief artificial delay for the loader effect
    setTimeout(() => setSubmitting(false), 500);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-border space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-accent/10 rounded-full">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Guest List</h2>
          <p className="text-muted-foreground">{rsvps?.length || 0} people attending so far!</p>
        </div>
      </div>

      <form onSubmit={handleRSVP} className="flex gap-4">
        <Input
          placeholder="Enter your name to RSVP"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 h-12"
          required
        />
        <Button type="submit" className="h-12 px-8 font-headline font-bold" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : "I'm Coming!"}
        </Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedRSVPs.map((rsvp) => (
          <div key={rsvp.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/50 animate-in fade-in zoom-in-95">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {rsvp.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold truncate text-foreground">{rsvp.name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> Attending
              </p>
            </div>
          </div>
        ))}
        {!loading && sortedRSVPs.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No RSVPs yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}
