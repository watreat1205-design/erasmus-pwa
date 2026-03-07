
export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-y-auto">
      {/* Fixed background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -260px",
        }}
      />

      {/* Overlays for readability */}
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* Page content */}
      <div className="relative">{children}</div>
    </div>
  );
}
