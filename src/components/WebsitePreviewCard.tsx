"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import type { WebsiteProject } from "@/data/site";

interface WebsitePreviewCardProps {
  project: WebsiteProject;
  index?: number;
}

export function WebsitePreviewCard({
  project,
  index = 0,
}: WebsitePreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shouldMountIframe, setShouldMountIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Lazy-mount iframes only once near viewport, staggered so initial page load stays instant
  useEffect(() => {
    const el = cardRef.current;
    if (!el || shouldMountIframe) return;

    let staggerTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          staggerTimer = setTimeout(() => {
            setShouldMountIframe(true);
          }, index * 180);
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (staggerTimer) clearTimeout(staggerTimer);
    };
  }, [index, shouldMountIframe]);

  useEffect(() => {
    if (!shouldMountIframe) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 6000);
    return () => clearTimeout(timer);
  }, [project.url, shouldMountIframe]);

  const handleIframeLoad = () => setIsLoading(false);

  const colIndex = index % 3;
  const rowIndex = Math.floor(index / 3);
  const entranceDelay = colIndex * 0.1 + rowIndex * 0.12;
  const floatDuration = `${(4.6 + colIndex * 0.7).toFixed(2)}s`;
  const floatDelay = `${(colIndex * 0.5 + rowIndex * 0.3).toFixed(2)}s`;
  const hostname = new URL(project.url).hostname;

  return (
    <motion.div
      ref={cardRef}
      className="relative flex w-full"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.65,
        delay: entranceDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Pure-CSS GPU-composited float wrapper */}
      <div
        className="animate-card-float relative flex w-full"
        style={
          {
            "--float-duration": floatDuration,
            "--float-delay": floatDelay,
          } as CSSProperties
        }
      >
        {/* Lightweight radial ambient aura (zero runtime Gaussian blur filter) */}
        <div
          aria-hidden="true"
          className="animate-card-aura pointer-events-none absolute -inset-4 rounded-3xl"
          style={
            {
              "--float-duration": floatDuration,
              "--float-delay": floatDelay,
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 45%, transparent 72%)",
            } as CSSProperties
          }
        />

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card-gpu glass-shine-container group relative flex h-full w-full flex-col overflow-hidden rounded-2xl hover:-translate-y-2.5 hover:scale-[1.02]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Live preview viewport isolated on its own compositor layer */}
          <div
            className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0a]"
            style={{ contain: "layout paint style", transform: "translateZ(0)" }}
          >
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                width: "400%",
                height: "400%",
                transform: "scale(0.25) translateZ(0)",
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0f172a] via-[#090d16] to-[#050505]">
                <Globe className="h-20 w-20 text-accent/40" />
                <span className="font-display text-3xl font-semibold tracking-wide text-white/30">
                  {hostname}
                </span>
              </div>

              {shouldMountIframe && (
                <iframe
                  src={project.url}
                  title={`Live preview of ${project.title}`}
                  className="absolute inset-0 h-full w-full border-0 bg-white"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={handleIframeLoad}
                />
              )}

              {shouldMountIframe && isLoading && (
                <div className="pointer-events-none absolute inset-0 z-[5] animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              )}
            </div>

            {/* Interaction shield — clicks pass through to the card link */}
            <div className="absolute inset-0 z-10" aria-hidden="true" />

            {/* Browser chrome */}
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center gap-2 border-b border-white/5 bg-black/80 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 truncate text-xs text-muted">
                {hostname}
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400/90">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            {/* Hover inner glow overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                boxShadow: "inset 0 0 60px rgba(59,130,246,0.22)",
              }}
            />

            {/* Visit site CTA overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/45"
                >
                  <span className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/25 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    Visit Live Site
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card body */}
          <div className="flex flex-1 flex-col gap-2.5 sm:gap-3 p-4 sm:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white transition-colors group-hover:text-accent-glow">
                {project.title}
              </h3>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted opacity-70 transition-opacity lg:opacity-0 lg:group-hover:opacity-100" />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 sm:gap-2 pt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-card-border bg-white/5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Edge glow */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-accent/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </a>
      </div>
    </motion.div>
  );
}
