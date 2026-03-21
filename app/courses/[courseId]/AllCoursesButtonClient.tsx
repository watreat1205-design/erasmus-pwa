"use client";

import Link from "next/link";

export default function AllCoursesButtonClient() {
  return (
    <Link
      href="/courses"
      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
    >
      ← Courses
    </Link>
  );
}
