import { PartyCreationForm } from "@/components/PartyCreationForm";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PartyPopper, Sparkles, Users, MessageSquare } from "lucide-react";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-party");

  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 drop-shadow-lg">
            Gather<span className="text-primary">Ease</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-body mb-8 drop-shadow-md">
            The simplest way to plan, share, and enjoy your parties.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl px-4 py-12 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Creation Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <PartyPopper className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold text-foreground">Plan Your Next Event</h2>
                <p className="text-muted-foreground">Fill in the details to get your magic share link.</p>
              </div>
            </div>
            <PartyCreationForm />
          </div>

          {/* Features / Info */}
          <div className="lg:col-span-5 space-y-8 lg:pt-12">
            <div className="flex gap-4 p-6 bg-white/50 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-accent">AI Brainstormer</h3>
                <p className="text-sm text-muted-foreground">Stuck for ideas? Our AI helper suggests themes, menus, and activities tailored to your vibe.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/50 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary">Simple RSVP</h3>
                <p className="text-sm text-muted-foreground">No accounts needed. Guests just enter their name to say "I'm coming!".</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/50 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-accent">Live Guest Chat</h3>
                <p className="text-sm text-muted-foreground">A dedicated real-time chat for every party to coordinate and build excitement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
