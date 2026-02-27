import BrandHeader from "@/components/brand/BrandHeader";
import Image from "next/image";

export default function QuizPaper({
  activityTitle,
  quizTitle,
  children,
}: {
  activityTitle: string; // e.g. "ACTIVITY 1.1: Exploring TEAL"
  quizTitle: string; // e.g. "Welcome to the ACTIVITY 1.1: Exploring TEAL Quiz!"
  children: React.ReactNode;
}) {
  return (

        <div className="min-h-screen bg-[#eaf4ef]">
           <div className="mx-auto w-full max-w-[900px] px-4 py-10">

        {/* A4-like sheet */}
        <div className="mx-auto w-full rounded-md border border-gray-200 bg-white shadow-sm">

          {/* Quiz header image */}
<div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
  <Image
    src="/ngo/quiz-header.png"
    alt="Quiz header"
    width={1600}
    height={400}
    className="h-auto w-full"
    priority
  />
</div>

          {/* Title box */}
          <div className="px-6 py-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="h-2 bg-[#3b8f6b]" />
              <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {activityTitle}
              </div>
              <h1 className="mt-2 text-xl font-semibold text-gray-900">
                {quizTitle}
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-700">
  This short quiz assesses your understanding of the TEAL approach. 
  Please answer the following questions based on what you have learned 
  in ACTIVITY 1.1: Exploring TEAL of MODULE 1: Introduction to TEAL teaching methodology. 
  The quiz will examine your knowledge of the definition of TEAL, its core components 
  (active learning, technology integration, and collaboration), its origins, and how it 
  compares to traditional teaching methods.
</p>

<p className="mt-4 text-sm leading-6 text-gray-700">
  "The best teachers are those who show you where to look, but don't tell you what to see." 
  – Alexandra K. Trenfor. We hope this quiz helps you see how TEAL can enhance your teaching!
</p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                <span className="font-semibold">Note:</span> The quiz is for learning.
                You can retake it if needed.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                <span className="text-red-600">*</span> Indicates required question
              </div>
              
             </div>
           </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
