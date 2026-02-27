"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    openVideoModal?: (url: string) => void;
  }
}

export default function VideoModalClient() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");

  useEffect(() => {
    window.openVideoModal = (url: string) => {
      setSrc(url);
      setOpen(true);
      document.body.style.overflow = "hidden";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      delete window.openVideoModal;
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setOpen(false);
    setSrc("");
    document.body.style.overflow = "";
  };

  if (!open) return null;

  return (
    <div className="video-modal">
      <div className="video-modal__backdrop" onClick={close}></div>

      <div className="video-modal__panel">
        <button className="video-modal__close" onClick={close}>×</button>
        <div className="video-modal__iframe-wrap">
          <iframe
            src={src}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        </div>
      </div>
    </div>
  );
}
