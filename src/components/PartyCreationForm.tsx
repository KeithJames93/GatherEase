
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export function PartyCreationForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const partyData = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      createdAt: serverTimestamp(),
    };

    const partiesCollection = collection(firestore, "parties");
    const newPartyRef = doc(partiesCollection);

    setDoc(newPartyRef, partyData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: newPartyRef.path,
          operation: 'create',
          requestResourceData: partyData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    // Optimistically redirect
    toast({
      title: "Party Created!",
      description: "Redirecting you to your event page.",
    });
    router.push(`/party/${newPartyRef.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Party Name</Label>
          <Input id="name" name="name" placeholder="Summer Rooftop Bash" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Where is it?</Label>
          <Input id="location" name="location" placeholder="Central Park, NY" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">What's the vibe?</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Join us for drinks, music and fun..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-lg font-headline font-bold" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Party...
          </>
        ) : (
          <>
            Create & Share
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
