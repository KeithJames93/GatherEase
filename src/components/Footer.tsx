import { PartyPopper, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-primary" />
            <span className="text-xl font-headline font-bold">GatherEase</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 font-body">
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for great parties.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground font-body">
            <span className="hover:text-primary cursor-pointer transition-colors underline-offset-4 hover:underline">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors underline-offset-4 hover:underline">Terms</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground font-body">
          &copy; {new Date().getFullYear()} GatherEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
