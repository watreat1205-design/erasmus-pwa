// src/components/layout/FooterPartners.tsx 
import Image from "next/image";

export default function FooterPartners() {
  return (
    <footer className="mt-24 pb-12">
      <div className="mx-auto max-w-5xl px-6">

        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-8 text-center">

          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/80 mb-6">
            Project Partners
          </h3>

          <div className="flex justify-center mb-6">
            <Image
              src="/partners/NGO-logos.jpg"
              alt="Project partner organizations"
              width={1200}
              height={250}
              className="w-full max-w-4xl h-auto object-contain"
              priority
            />
          </div>

          <p className="text-xs text-white/70 max-w-3xl mx-auto leading-relaxed">
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
