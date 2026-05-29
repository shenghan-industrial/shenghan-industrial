"use client";

import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoSectionProps {
  imageSrc?: string;
  videoUrl?: string;
  className?: string;
}

export function VideoSection({
  imageSrc = "/images/factory-bg.svg",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  className = "",
}: VideoSectionProps) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <section className={`relative overflow-hidden ${className}`}>
        <div
          className="relative h-[320px] md:h-[450px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageSrc})` }}
        >
          <div className="absolute inset-0 bg-brand-900/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center shadow-2xl shadow-accent/30 hover:bg-accent-light transition-colors duration-300 group"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 text-brand-900 ml-1 group-hover:scale-110 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current) setOpen(false);
          }}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video"
          >
            <iframe
              src={open ? videoUrl : ""}
              className="w-full h-full rounded-xl"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Company video"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
