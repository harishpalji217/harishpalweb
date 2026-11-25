"use client";

import { Reveal } from "@/components/ui/Reveal";
import { websites } from "@/data/site";
import { WebsitePreviewCard } from "@/components/WebsitePreviewCard";

const COLUMN_STAGGER = [
  "md:mt-0 lg:mt-0",
  "md:mt-6 lg:mt-8",
  "md:mt-0 lg:mt-4",
  "md:mt-6 lg:mt-0",
  "md:mt-0 lg:mt-8",
  "md:mt-6 lg:mt-4",
] as const;

export function PortfolioLinks() {
  return (
    <section id="portfolio" className="relative py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Portfolio
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Links to Some of My Websites
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-muted">
            Each project is shown with a live preview. Tap any card to visit
            the full website.
          </p>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 pb-6 sm:pb-8">
          {websites.map((project, i) => (
            <div key={project.id} className={`flex ${COLUMN_STAGGER[i % 6]}`}>
              <WebsitePreviewCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
