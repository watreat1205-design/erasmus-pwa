// lib/videoModal.ts
export function openVideoModal(url: string) {
  const modal = document.getElementById("videoModal");
  const container = document.getElementById("videoModalContainer");

  if (!modal || !container) return;

  container.innerHTML = `
    <iframe
      src="${url}"
      width="100%"
      height="100%"
      style="border:0;"
      allow="autoplay; fullscreen"
      allowfullscreen
    ></iframe>
  `;

  modal.classList.remove("hidden");
}

export function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const container = document.getElementById("videoModalContainer");

  if (!modal || !container) return;

  container.innerHTML = "";
  modal.classList.add("hidden");
}
declare global {
  interface Window {
    openVideoModal?: (url: string) => void;
    closeVideoModal?: () => void;
  }
}

if (typeof window !== "undefined") {
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;
}
