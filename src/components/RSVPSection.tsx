"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, CheckCircle2, Loader2 } from "lucide-react";

interface RSVPSectionProps {
  partyId: string;
}

export function RSVPSection({ partyId }: RSVPSectionProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [rsvps, setRsvps] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "rsvps"),
      where("partyId", "==", partyId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRsvps(data);
    });
    return () => unsubscribe();
  }, [partyId]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "rsvps"), {
        partyId,
        name,
        createdAt: serverTimestamp(),
      });
      setName("");
    } catch (error) {
      console.error("Error RSVPing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-border space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-accent/10 rounded-full">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">Guest List</h2>
          <p className="text-muted-foreground">{rsvps.length} people attending so far!</p>
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
        <Button type="submit" className="h-12 px-8 font-headline font-bold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "I'm Coming!"}
        </Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rsvps.map((rsvp) => (
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
        {rsvps.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No RSVPs yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}
