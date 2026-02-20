"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <PartyPopper className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-headline font-bold text-foreground">
            Gather<span className="text-primary">Ease</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#plan" className="text-sm font-medium hover:text-primary transition-colors">
            Start Planning
          </Link>
        </div>
      </div>
    </nav>
  );
}
