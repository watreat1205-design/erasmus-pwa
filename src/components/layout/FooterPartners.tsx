import Image from "next/image";

export default function FooterPartners({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <footer className="mt-0 pb-0">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={
            compact
              ? "rounded-t-[28px] border border-white/20 bg-white/10 p-3 text-center shadow-xl backdrop-blur-xl"
              : "rounded-t-[28px] border border-white/20 bg-white/10 p-4 text-center shadow-xl backdrop-blur-xl"
          }
        >
          <div
            className={
              compact
                ? "rounded-[22px] bg-white/5 px-4 py-3"
                : "rounded-[22px] bg-white/5 px-6 py-6"
            }
          >
            <h3
              className={
                compact
                  ? "mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/80"
                  : "mb-6 text-sm font-semibold uppercase tracking-widest text-white/80"
              }
            >
              Project Partners
            </h3>

            <div className={compact ? "mb-3 flex justify-center" : "mb-6 flex justify-center"}>
              <Image
                src="/partners/NGO-logos.jpg"
                alt="Project partner organizations"
                width={1200}
                height={250}
                className={
                  compact
                    ? "h-auto w-full max-w-[820px] object-contain"
                    : "h-auto w-full max-w-4xl object-contain"
                }
                priority
              />
            </div>

            <p
              className={
                compact
                  ? "mx-auto max-w-4xl text-[10px] leading-relaxed text-white/70"
                  : "mx-auto max-w-3xl text-xs leading-relaxed text-white/70"
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
      </div>
    </footer>
  );
}
