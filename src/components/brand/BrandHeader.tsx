// src/components/brand/BrandHeader.tsx
import Image from "next/image";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function BrandHeader({ className = "", size = "md" }: Props) {

  const height =
    size === "sm" ? 36 :
    size === "lg" ? 90 :
    50;

  const hClass =
    size === "sm" ? "h-10" :
    size === "lg" ? "h-24" :
    "h-14";

  return (
    <div
      className={
        "mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 " + className
      }
    >
      {/* MOBILE: stacked / DESKTOP: row */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">

        {/* DROPS */}
        <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/brand/drops-logo.png"
            alt="DROPS of Sustainable Development"
            width={320}
            height={height}
            className={`${hClass} w-auto object-contain`}
            priority
          />
        </div>

        {/* ERASMUS */}
        <div className="flex items-center justify-center">
          <Image
            src="/quiz-brand/erasmus.png"
            alt="Co-funded by the Erasmus+ Programme of the European Union"
            width={360}
            height={height}
            className="h-12 md:h-14 w-auto object-contain"
            priority
          />
        </div>

        {/* CCIF */}
        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/quiz-brand/ccif.png"
            alt="CCIF CY"
            width={140}
            height={height}
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}

