import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import BulkPublishClient from "./ui/BulkPublishClient";

export default async function AuthorCoursesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, is_published, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-xl font-semibold text-gray-900">Author / Courses</h1>
      <p className="mt-1 text-sm text-gray-600">
        Select multiple courses and publish/unpublish in bulk.
      </p>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error.message}</p>
      ) : (
        <BulkPublishClient courses={courses ?? []} />
      )}
    </div>
  );
}
