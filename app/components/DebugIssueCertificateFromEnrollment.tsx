import { issueCertificateForFirstEnrollment } from "../actions/issueCertificateForFirstEnrollment";

export default function DebugIssueCertificateFromEnrollment() {
  return (
    <form
      action={async () => {
        "use server";
        await issueCertificateForFirstEnrollment();
      }}
    >
      <button
        type="submit"
        className="rounded bg-black px-3 py-2 text-white"
      >
        Debug: Issue certificate (my latest enrollment)
      </button>
    </form>
  );
}
