// app/support/page.tsx
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="relative min-h-screen overflow-y-auto">
      {/* 🌄 Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {/* 📦 Content */}
      <div className="relative">
        <div className="mx-auto max-w-3xl px-6 py-10 text-white">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">Support</h1>

            <Link
              href="/dashboard"
              className="rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              ← Back
            </Link>
          </div>

          <div className="rounded-xl bg-white/90 text-slate-900 p-6 shadow backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            <p className="mb-4">
              For any issues or questions, please contact:
            </p>
            <p className="font-medium">support@drops-sustainability.eu</p>

            <hr className="my-6" />

            <h2 className="text-lg font-semibold mb-3">FAQ</h2>
            <ul className="space-y-2 text-sm">
              <li>• How to access modules → Go to “My Courses”</li>
              <li>• How to complete quizzes → Open a module and click “Module Quiz”</li>
              <li>• How to get certificate → Complete all modules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
