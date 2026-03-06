// app/courses/EnrollButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onEnroll = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Guest → login, then return to this exact course page
      if (!user) {
        router.push(`/login?next=/courses/${courseId}`);
        return;
      }

      // First check if already enrolled
      const { data: existingEnrollment, error: existingError } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingError) {
        alert(existingError.message);
        return;
      }

      // If not enrolled yet, insert enrollment
      if (!existingEnrollment) {
        const { error: insertError } = await supabase
          .from("course_enrollments")
          .insert({
            course_id: courseId,
            user_id: user.id,
          });

        if (insertError) {
          const msg = (insertError.message || "").toLowerCase();
          const already =
            msg.includes("duplicate") ||
            msg.includes("already") ||
            msg.includes("unique");

          if (!already) {
            alert(insertError.message);
            return;
          }
        }
      }

      // Force fresh server state after enroll/already-enrolled
      router.replace(`/courses/${courseId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onEnroll}
      disabled={loading}
      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
    >
      {loading ? "Please wait..." : "Enroll now"}
    </button>
  );
}
