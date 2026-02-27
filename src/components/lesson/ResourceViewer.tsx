"use client";

type ResourceViewerProps = {
  url: string;
  label?: string;
};

export default function ResourceViewer({ url, label }: ResourceViewerProps) {
  if (!url) return null;

  const lower = url.toLowerCase();

  return (
    <div className="mt-4">
      {label ? (
        <div className="mb-2 text-sm text-gray-600 break-words">{label}</div>
      ) : null}

      {/* PDF */}
      {lower.endsWith(".pdf") ? (
        <div className="rounded-lg border">
          <iframe src={url} className="h-[600px] w-full rounded-lg" />
        </div>
      ) : lower.includes("youtube.com") || lower.includes("youtu.be") ? (
        (() => {
          let embed = url;
          if (url.includes("watch?v=")) embed = url.replace("watch?v=", "embed/");
          return (
            <iframe
              src={embed}
              className="h-[400px] w-full rounded-lg"
              allowFullScreen
            />
          );
        })()
      ) : lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") ? (
        <video controls className="w-full rounded-lg border" src={url} />
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-md border px-3 py-2 text-sm"
        >
          Open resource
        </a>
      )}
    </div>
  );
}
