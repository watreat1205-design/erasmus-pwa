export default function QuestionCard({
  index,
  required,
  points,
  prompt,
  children,
}: {
  index: number;
  required?: boolean;
  points?: number;
  prompt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-gray-900">
          {index}. {prompt}{" "}
          {required ? <span className="text-red-600">*</span> : null}
        </div>
        {typeof points === "number" ? (
          <div className="text-xs font-semibold text-gray-500">
            {points} point{points === 1 ? "" : "s"}
          </div>
        ) : null}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
