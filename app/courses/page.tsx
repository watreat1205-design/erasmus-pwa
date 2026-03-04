// app/courses/page.tsx
import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CoursesHeaderClient from "./CoursesHeaderClient";
import bgTemplate5 from "../../Templates/5.jpg";
import CoursesPublicHeader from "./CoursesPublicHeader";

export const dynamic = "force-dynamic";

export default async function CoursesPublicPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
  .from("courses")
  .select("id, title, description")
  .eq("is_published", true)
  .order("title", { ascending: true });

const courses = data ?? [];

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Image
          src={bgTemplate5}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 py-10 text-white">
          <div className="mb-4">
            <Link
              href="/welcome"
              className="inline-flex items-center rounded-md bg-black/40 px-2 py-1 text-sm font-medium !text-white backdrop-blur-sm hover:bg-black/60"
            >
              ← Back to welcome
            </Link>
          </div>

          <h1 className="mt-6 text-2xl font-semibold">Courses</h1>
          <p className="mt-2 text-white/90">Could not load courses.</p>

          <pre className="mt-4 overflow-auto rounded-xl bg-black/40 p-4 text-xs">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -translate-y-7">
        <Image
          src={bgTemplate5}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-10">
         <div className="flex items-start justify-between gap-4">
         <CoursesPublicHeader />
         <div className="shrink-0">
         <CoursesHeaderClient />
         </div>
        </div>

          {!courses?.length ? (
            <div className="mt-8 rounded-xl border border-white/20 bg-white/85 p-6">
              <p className="text-gray-800">No published courses yet.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-white/20 bg-white/85 p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {c.title}
                        </h2>
                        <span className="text-gray-400">→</span>
                      </div>

                      {c.description ? (
                        <p className="mt-2 text-sm text-gray-700">
                          {c.description}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          No description.
                        </p>
                      )}

                      <Link
                        href={`/courses/${c.id}`}
                        className="mt-4 inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium !text-white hover:bg-gray-900"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
