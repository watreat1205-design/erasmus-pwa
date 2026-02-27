export function toEmbed(url: string) {
  const u = url.trim();

  // YouTube
  if (u.includes("youtube.com/watch?v=")) {
    const id = u.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (u.includes("youtu.be/")) {
    const id = u.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  // Vimeo
  if (u.includes("vimeo.com/")) {
    const id = u.split("vimeo.com/")[1].split(/[?&#/]/)[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }

  return u;
}
