import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-gray-600">Read-only dashboards for admins.</p>

      <div className="space-y-2">
        <div><Link className="underline" href="/admin/users">Users</Link></div>
        <div><Link className="underline" href="/admin/enrollments">Enrollments</Link></div>
        <div><Link className="underline" href="/admin/progress">Progress</Link></div>
        <div><Link className="underline" href="/admin/quiz-results">Quiz Results</Link></div>
      </div>
    </div>
  );
}
