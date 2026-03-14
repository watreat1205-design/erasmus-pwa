//  src/lib/toEmbed.ts
export function toEmbed(url: string) {
  const u = url.trim();

  try {
    const parsed = new URL(u);
    const host = parsed.hostname.toLowerCase();

    // ---- YOUTUBE ----
    if (
      host.includes("youtube.com") ||
      host.includes("youtu.be") ||
      host.includes("youtube-nocookie.com")
    ) {
      let id: string | null = null;

      // youtu.be/<id>
      if (host.includes("youtu.be")) {
        id = parsed.pathname.replace("/", "");
      }

      // youtube.com/watch?v=<id>
      if (!id && parsed.searchParams.get("v")) {
        id = parsed.searchParams.get("v");
      }

      // youtube.com/embed/<id>
      if (!id && parsed.pathname.includes("/embed/")) {
        id = parsed.pathname.split("/embed/")[1].split("/")[0];
      }

      // youtube.com/shorts/<id>
      if (!id && parsed.pathname.includes("/shorts/")) {
        id = parsed.pathname.split("/shorts/")[1].split("/")[0];
      }

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    // ---- VIMEO ----
    if (host.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}
