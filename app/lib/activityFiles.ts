import { createSupabaseServerClient } from "@/lib/supabase/server";

type StorageFile = {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: any;
};

export async function listActivityFiles(storagePath: string): Promise<StorageFile[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("course-assets")
    .list(storagePath, { limit: 100, sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.error("listActivityFiles error", error);
    return [];
  }

  // remove folders + weird entries
  return (data ?? []).filter((f: any) => f?.name && !f?.name.endsWith("/"));
}

export function publicUrlFor(storagePath: string, fileName: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/course-assets/${storagePath}/${encodeURIComponent(
    fileName
  )}`;
}
