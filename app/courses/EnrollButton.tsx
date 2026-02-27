"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "./actions";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await enrollInCourse(courseId);
          router.refresh(); // ✅ makes Enroll -> Continue immediately
        })
      }
      disabled={pending}
      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? "Enrolling..." : "Enroll"}
    </button>
  );
}
