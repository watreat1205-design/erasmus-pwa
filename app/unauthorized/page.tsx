import Link from "next/link";
export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-xl p-10 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Access denied
      </h1>

      <p className="mt-4 text-gray-600">
        You don’t have permission to view this page.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2 text-white hover:bg-gray-800"
      >
        Go back home
      </Link>
    </div>
  );
}
