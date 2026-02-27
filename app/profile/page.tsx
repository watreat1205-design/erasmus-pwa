import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <Link href="/dashboard" className="text-sm underline">
          Back
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-700">
          Profile screen coming next.
        </p>
      </div>
    </div>
  );
}
