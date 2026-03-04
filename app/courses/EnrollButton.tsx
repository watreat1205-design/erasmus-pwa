"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();

  const onEnroll = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Guest → login, then return to this course page
    if (!user) {
      router.push(`/login?next=/courses/${courseId}`);
      return;
    }

    const { error } = await supabase.from("course_enrollments").insert({
      course_id: courseId,
      user_id: user.id,
    });

    // If you have a unique constraint, ignore "already enrolled" errors
    if (error) {
      const msg = (error.message || "").toLowerCase();
      const already =
        msg.includes("duplicate") ||
        msg.includes("already") ||
        msg.includes("unique");

      if (!already) {
        alert(error.message);
        return;
      }
    }

    router.refresh(); // refresh server page to unlock activities
  };

  return (
    <button
      onClick={onEnroll}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
    >
      Enroll now
    </button>
  );
}
