"use client";

import { PROFILE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 py-4 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground border-t border-border">
      <p>
        © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
      </p>
    </footer>
  );
}
