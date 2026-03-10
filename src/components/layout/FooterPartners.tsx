// src/components/layout/FooterPartners.tsx
import Image from "next/image";

export default function FooterPartners({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <footer className={compact ? "mt-10 pb-6" : "mt-24 pb-12"}>
      <div className={compact ? "mx-auto max-w-6xl px-4" : "mx-auto max-w-5xl px-6"}>
        <div
          className={
            compact
              ? "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl py-4 px-5 text-center"
              : "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-8 text-center"
          }
        >
          <h3
            className={
              compact
                ? "text-[11px] font-semibold uppercase tracking-widest text-white/80 mb-4"
                : "text-sm font-semibold uppercase tracking-widest text-white/80 mb-6"
            }
          >
            Project Partners
          </h3>

          <div className={compact ? "flex justify-center mb-4" : "flex justify-center mb-6"}>
            <Image
              src="/partners/NGO-logos.jpg"
              alt="Project partner organizations"
              width={1200}
              height={250}
              className={
                compact
                  ? "w-full max-w-3xl h-auto object-contain"
                  : "w-full max-w-4xl h-auto object-contain"
              }
              priority
            />
          </div>

          <p
            className={
              compact
                ? "text-[11px] text-white/70 max-w-4xl mx-auto leading-relaxed"
                : "text-xs text-white/70 max-w-3xl mx-auto leading-relaxed"
            }
          >
            Funded by the European Union. Views and opinions expressed are
            however those of the author(s) only and do not necessarily reflect
            those of the European Union or the European Education and Culture
            Executive Agency (EACEA). Neither the European Union nor EACEA can
            be held responsible for them.
          </p>
        </div>
      </div>
    </footer>
  );
}
