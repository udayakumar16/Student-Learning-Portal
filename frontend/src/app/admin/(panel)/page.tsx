import Link from "next/link";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Admin Overview" subtitle="Manage quiz questions and keep assessments ready." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="text-xs font-semibold text-white/70">Workflow</div>
          <div className="mt-2 text-lg font-extrabold">Question bank → Quiz</div>
          <div className="mt-2 text-sm text-white/70">Keep each subject stocked with enough questions.</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Subjects</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">3</div>
          <div className="mt-1 text-sm text-slate-600">Python, AI, DBMS</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Recommended</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">15+</div>
          <div className="mt-1 text-sm text-slate-600">Total questions for full coverage</div>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <div className="text-sm font-extrabold text-slate-900">Manage Questions</div>
            <div className="mt-1 text-sm text-slate-600">Create and delete questions for Python, AI, and DBMS.</div>
            <div className="mt-4">
              <Link
                href="/admin/questions"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Open Questions
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
            <div className="text-sm font-extrabold text-slate-900">How quizzes work</div>
            <div className="mt-1 text-sm text-slate-600">
              Students see questions by subject. If a subject has no questions, the quiz page shows an empty state.
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500">Tip: Add enough questions per subject.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
