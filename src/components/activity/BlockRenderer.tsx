"use client";

import { useMemo, useState } from "react";
import type { ActivityBlock, BlockSubmission } from "@/lib/activity/types";
import { upsertBlockSubmission } from "@/actions/activityActions";
import { toEmbed } from "@/lib/toEmbed";

type ActivityContent = {
  // common
  title?: string | null;

  // rich_text
  body_html?: string | null;

  // image / video / download
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
  fallback_text?: string | null;
  label?: string | null;

  // callout
  text?: string | null;

  // submission blocks
  prompt?: string | null;
  helper_text?: string | null;
  description?: string | null;
};

function normalizeContent(value: unknown): ActivityContent {
  if (!value || typeof value !== "object") return {};
  const r = value as Record<string, unknown>;

  const s = (k: string): string | null =>
    typeof r[k] === "string" ? (r[k] as string) : null;

  return {
    title: s("title"),
    body_html: s("body_html"),

    url: s("url"),
    alt: s("alt"),
    caption: s("caption"),
    fallback_text: s("fallback_text"),
    label: s("label"),

    text: s("text"),

    prompt: s("prompt"),
    helper_text: s("helper_text"),
    description: s("description"),
  };
}

function isSubmissionBlock(blockType: string) {
  return ["reflection", "form", "case_study"].includes(blockType);
}

export default function BlockRenderer({
  block,
  existingSubmission,
}: {
  block: ActivityBlock;
  existingSubmission?: BlockSubmission | null;
}) {
  const type = block.block_type;

  // ✅ content comes from the block JSON (not "activity")
  const content = normalizeContent(block.content_json ?? {});

  const [saving, setSaving] = useState(false);

  const initialText = useMemo(() => {
    const raw = existingSubmission?.submission_json;

    if (!raw || typeof raw !== "object") return "";

    const s = raw as Record<string, unknown>;
    const text = typeof s.text === "string" ? s.text : null;
    const value = typeof s.value === "string" ? s.value : null;

    return text ?? value ?? "";
  }, [existingSubmission]);

  const [text, setText] = useState<string>(initialText);
  const [status, setStatus] = useState<"draft" | "submitted">(
    existingSubmission?.status ?? "draft"
  );

  async function save(nextStatus: "draft" | "submitted") {
    if (!isSubmissionBlock(type)) return;

    setSaving(true);
    try {
      const submissionPayload =
        type === "reflection"
          ? { text }
          : { value: text, meta: { block_type: type } };

      await upsertBlockSubmission({
        blockId: block.id,
        status: nextStatus,
        submission: submissionPayload,
      });

      setStatus(nextStatus);
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------
  // Renderers
  // ----------------------------

  if (type === "rich_text") {
    return (
      <section className="rounded-2xl border p-5 bg-white">
        {content.title && (
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
        )}
        {content.body_html ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.body_html }}
          />
        ) : (
          <p className="text-sm text-gray-600">No content.</p>
        )}
      </section>
    );
  }

  if (type === "image") {
    return (
      <section className="rounded-2xl border p-5 bg-white">
        {content.title && (
          <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
        )}
        {content.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.url}
            alt={content.alt ?? ""}
            className="w-full rounded-xl border"
          />
        ) : (
          <p className="text-sm text-gray-600">No image URL.</p>
        )}
        {content.caption && (
          <p className="text-sm text-gray-600 mt-2">{content.caption}</p>
        )}
      </section>
    );
  }

if (type === "embed_video") {
  const url = content.url ?? "";

  const toEmbed = (u: string) => {
    if (u.includes("youtube.com/watch?v=")) return u.replace("watch?v=", "embed/");
    if (u.includes("youtu.be/")) {
      const id = u.split("youtu.be/")[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : u;
    }
    return u;
  };

  return (
    <section className="rounded-2xl border p-5 bg-white">
      {content.title && (
        <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
      )}

      {url ? (
        <button
          type="button"
          onClick={() => window.openVideoModal?.(toEmbed(url))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          ▶ Watch video
        </button>
      ) : (
        <p className="text-sm text-gray-600">No video URL.</p>
      )}

      {content.caption && (
        <p className="text-sm text-gray-600 mt-2">{content.caption}</p>
      )}
    </section>
  );
}

  if (type === "download") {
    return (
      <section className="rounded-2xl border p-5 bg-white">
        <div className="font-semibold mb-1">{content.title ?? "Download"}</div>
        {content.url ? (
          <a
            className="text-blue-600 underline"
            href={content.url}
            target="_blank"
            rel="noreferrer"
          >
            {content.label ?? "Open file"}
          </a>
        ) : (
          <p className="text-sm text-gray-600">No file URL.</p>
        )}
      </section>
    );
  }

  if (type === "callout") {
    return (
      <section className="rounded-2xl border p-5 bg-white">
        <div className="font-semibold mb-1">{content.title ?? "Note"}</div>
        <div className="text-sm text-gray-700">{content.text ?? ""}</div>
      </section>
    );
  }

  if (type === "divider") {
    return <hr className="my-2 border-gray-200" />;
  }

  // --- Submission blocks (trainer writes answers) ---
  if (type === "reflection" || type === "form" || type === "case_study") {
    const fallbackTitle =
      type === "reflection"
        ? "Reflection"
        : type === "form"
        ? "Activity Form"
        : "Case Study Response";

    return (
      <section className="rounded-2xl border p-5 bg-white">
        <h3 className="text-lg font-semibold mb-2">
          {content.title ?? content.prompt ?? fallbackTitle}
        </h3>

        {content.helper_text && (
          <p className="text-sm text-gray-600 mb-3">{content.helper_text}</p>
        )}
        {content.description && (
          <p className="text-sm text-gray-600 mb-3">{content.description}</p>
        )}

        <textarea
          className="w-full rounded-xl border p-3 min-h-[160px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your answer..."
        />

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            className="rounded-xl border px-4 py-2"
            disabled={saving}
            onClick={() => save("draft")}
          >
            {saving ? "Saving..." : "Save draft"}
          </button>

          <button
            type="button"
            className="rounded-xl bg-black text-white px-4 py-2"
            disabled={saving}
            onClick={() => save("submitted")}
          >
            {saving
              ? "Submitting..."
              : status === "submitted"
              ? "Submitted"
              : "Submit"}
          </button>
        </div>
      </section>
    );
  }

  // Fallback: show JSON so you can debug quickly
  return (
    <section className="rounded-2xl border p-5 bg-white">
      <div className="font-semibold">Unsupported block: {type}</div>
      <pre className="text-xs mt-2 overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </section>
  );
}
