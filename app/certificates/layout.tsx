import bgTemplate5 from "../../Templates/5.jpg";

export default function CertificatesLayout({
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
          backgroundImage: `url(${bgTemplate5.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -410px",
        }}
      />

      {/* Overlays */}
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
