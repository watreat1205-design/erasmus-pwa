import Image from "next/image";

  type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function BrandHeader({ className = "", size = "md" }: Props) {
  const height =
    size === "sm" ? 36 :
    size === "lg" ? 80 :
    44;

  const hClass =
    size === "sm" ? "h-9" :
    size === "lg" ? "h-20" :
    "h-11";

  return (
    <div
      className={
        "mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 " + className
      }
    >
      <div className="grid grid-cols-3 items-center gap-3">
        {/* LEFT: DROPS */}
        <div className="flex items-center justify-start">
          <Image
            src="/brand/drops-logo.png"
            alt="DROPS of Sustainable Development"
            width={260}
            height={height}
            className={`${hClass} w-auto object-contain`}
            priority
          />
        </div>

        {/* CENTER: ERASMUS */}
        <div className="flex items-center justify-center">
          <Image
            src="/quiz-brand/erasmus.png"
            alt="Co-funded by the Erasmus+ Programme of the European Union"
            width={360}
            height={height}
            className={`${hClass} w-auto object-contain`}
            priority
          />
        </div>

        {/* RIGHT: CCIF (force smaller) */}
        <div className="flex items-center justify-end">
          <Image
            src="/quiz-brand/ccif.png"
            alt="CCIF CY"
            width={140}
            height={height}
            className={`${hClass} w-auto object-contain`}
            priority
          />
        </div>
      </div>
    </div>
  );
}
