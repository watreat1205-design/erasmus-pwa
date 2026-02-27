import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Support</h1>

      <p className="mt-4">Support and FAQs will be available soon.</p>

      <Link
        href="/dashboard"
        className="inline-block mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
