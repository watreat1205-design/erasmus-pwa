import { issueCertificateTest } from "../actions/issueCertificateTest";

export default function DebugIssueCertificate({
  courseId,
}: {
  courseId: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await issueCertificateTest(courseId);
      }}
    >
      <button
        type="submit"
        className="mt-4 rounded bg-black px-3 py-2 text-white"
      >
        Debug: Issue certificate
      </button>
    </form>
  );
}
