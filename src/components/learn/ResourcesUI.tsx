"use client";

import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

export type Resource = { title: string; url: string; mime?: string };

function getExt(url: string) {
  const clean = url.split("?")[0];
  const parts = clean.split(".");
  return (parts[parts.length - 1] || "").toLowerCase();
}

function kindOf(url: string, mime?: string) {
  const ext = getExt(url);
  if (mime?.includes("pdf") || ext === "pdf") return "pdf";
  if (mime?.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "doc";
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
  return "link";
}

export function ResourcesSidebar({ resources }: { resources: Resource[] }) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">{t("resources.title")}</div>
          <div className="text-xs text-gray-500">{resources.length}</div>
        </div>

        <div className="mt-3 space-y-2">
          {resources.map((r) => {
            const kind = kindOf(r.url, r.mime);
            return (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                <div className="truncate font-medium text-gray-900">{r.title}</div>
                <div className="text-xs text-gray-500">{kind}</div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ResourceCard({ r }: { r: Resource }) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");
  const kind = kindOf(r.url, r.mime);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">{r.title}</div>
          <div className="mt-1 text-xs text-gray-500 uppercase tracking-wide">{kind}</div>
        </div>

        <div className="flex shrink-0 gap-2">
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white px-3 py-2 text-xs hover:bg-gray-50"
          >
            {t("resources.open")}
          </a>
          <a
            href={r.url}
            download
            className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white hover:bg-black"
          >
            {t("resources.download")}
          </a>
        </div>
      </div>

      <div className="mt-4">
        <ResourceEmbed url={r.url} kind={kind} title={r.title} />
      </div>
    </div>
  );
}

export function ResourceEmbed({
  url,
  kind,
  title,
}: {
  url: string;
  kind: string;
  title: string;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  const isYouTube = /youtube\.com|youtu\.be/.test(url);
  const isVimeo = /vimeo\.com/.test(url);

  if (kind === "pdf") {
    return (
      <div className="overflow-hidden rounded-2xl border bg-gray-50">
        <div className="aspect-[4/3] w-full">
          <iframe title={title} src={url} className="h-full w-full" />
        </div>
        <div className="flex items-center justify-between border-t bg-white px-3 py-2">
          <div className="text-xs text-gray-600">{t("resources.pdfPreview")}</div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-gray-900 underline"
          >
            {t("resources.openFullscreen")}
          </a>
        </div>
      </div>
    );
  }

  if (kind === "video") {
    if (isYouTube || isVimeo) {
      return (
        <div className="overflow-hidden rounded-2xl border bg-black">
          <div className="aspect-video w-full">
            <iframe
              title={title}
              src={url}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-2xl border bg-black">
        <video controls className="h-auto w-full" preload="metadata">
          <source src={url} />
        </video>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="overflow-hidden rounded-2xl border bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={title} className="h-auto w-full" />
      </div>
    );
  }

  if (kind === "doc") {
    return (
      <div className="rounded-2xl border bg-gray-50 p-4">
        <div className="text-sm text-gray-800">{t("resources.docHint")}</div>
        <div className="mt-3 flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white px-3 py-2 text-xs hover:bg-gray-50"
          >
            {t("resources.openDocument")}
          </a>
          <a
            href={url}
            download
            className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white hover:bg-black"
          >
            {t("resources.download")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <a className="text-sm underline" href={url} target="_blank" rel="noreferrer">
        {t("resources.openResource")}
      </a>
    </div>
  );
}
