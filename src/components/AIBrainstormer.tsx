"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { brainstormPartyIdeas } from "@/ai/flows/brainstorm-party-ideas-flow";
import { Sparkles, Loader2, PartyPopper, Utensils, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIBrainstormerProps {
  party: {
    name: string;
    description: string;
    date: string;
  };
}

export function AIBrainstormer({ party }: AIBrainstormerProps) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any>(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const { toast } = useToast();

  const handleBrainstorm = async () => {
    setLoading(true);
    try {
      const result = await brainstormPartyIdeas({
        partyName: party.name,
        partyDate: party.date,
        specialRequests,
      });
      setIdeas(result);
    } catch (error) {
      console.error("AI Brainstorm error:", error);
      toast({
        variant: "destructive",
        title: "Brainstorm failed",
        description: "Our AI is currently taking a nap. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-border space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-accent/10 rounded-full">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-foreground">AI Brainstormer</h2>
          <p className="text-muted-foreground">Let AI generate magic ideas for your event.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="requests">What specifically do you need ideas for?</Label>
          <Textarea
            id="requests"
            placeholder="e.g. Unique cocktail names, beach-themed activities, low-budget decorations..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleBrainstorm} className="w-full h-12 font-headline font-bold bg-accent hover:bg-accent/90" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Surprise Me!
            </>
          )}
        </Button>
      </div>

      {ideas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95">
          {ideas.themes?.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <PartyPopper className="w-5 h-5" />
                  <h3 className="font-headline font-bold text-lg">Theme Ideas</h3>
                </div>
                <ul className="space-y-3">
                  {ideas.themes.map((t: any, i: number) => (
                    <li key={i} className="text-sm bg-white p-3 rounded-lg border border-border shadow-sm">
                      <b className="block mb-1">{t.name}</b>
                      <span className="text-muted-foreground">{t.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {ideas.activities?.length > 0 && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-accent">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-headline font-bold text-lg">Activities</h3>
                </div>
                <ul className="space-y-3">
                  {ideas.activities.map((a: any, i: number) => (
                    <li key={i} className="text-sm bg-white p-3 rounded-lg border border-border shadow-sm">
                      <b className="block mb-1">{a.name}</b>
                      <span className="text-muted-foreground">{a.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {ideas.menuSuggestions?.length > 0 && (
            <Card className="col-span-full border-rose-200 bg-rose-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-accent">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-headline font-bold text-lg">Food & Drinks</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ideas.menuSuggestions.map((m: any, i: number) => (
                    <div key={i} className="text-sm bg-white p-3 rounded-lg border border-border shadow-sm">
                      <b className="block mb-1">{m.item}</b>
                      <span className="text-muted-foreground">{m.reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
