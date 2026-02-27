
import dynamic from "next/dynamic";

const PdfDocumentViewer = dynamic(() => import("./PdfDocumentViewer"), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-gray-600">Loading PDF…</div>,
});

export default PdfDocumentViewer;
