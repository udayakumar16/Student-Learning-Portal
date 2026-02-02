"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SUBJECTS } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AssessmentPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Assessment" subtitle="Choose a subject to begin a quiz." />

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {SUBJECTS.map((s) => (
            <Link
              key={s.slug}
              href={`/dashboard/assessment/${s.slug}/instructions`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">{s.label}</div>
                  <div className="mt-1 text-xs text-slate-500">MCQ questions • No negative marking</div>
                </div>
                <div className="rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-90 group-hover:opacity-100">
                  Start
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
