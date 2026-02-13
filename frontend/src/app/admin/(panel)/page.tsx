"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type AdminSubject = { _id: string; slug: string; label: string; active: boolean };
type AdminQuestion = { _id: string; subject: string };
type AdminAnalyticsKpis = { students: number; attempts: number; avgScorePct: number };

export default function AdminHomePage() {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [kpis, setKpis] = useState<AdminAnalyticsKpis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.allSettled([
      apiFetch<{ subjects: AdminSubject[] }>("/api/admin/subjects"),
      apiFetch<{ questions: AdminQuestion[] }>("/api/admin/questions"),
      apiFetch<{ kpis: AdminAnalyticsKpis }>("/api/admin/analytics")
    ])
      .then(([s, q, a]) => {
        if (!alive) return;
        if (s.status === "fulfilled") setSubjects(s.value.subjects);
        if (q.status === "fulfilled") setQuestions(q.value.questions);
        if (a.status === "fulfilled") setKpis(a.value.kpis);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const activeSubjects = useMemo(() => subjects.filter((s) => s.active), [subjects]);
  const activeSubjectLabels = useMemo(
    () => activeSubjects.map((s) => s.label).sort((a, b) => a.localeCompare(b)),
    [activeSubjects]
  );

  const totalQuestions = questions.length;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Admin Overview"
        subtitle="Monitor activity, manage subjects, and keep question banks ready."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/subjects">
              <Button variant="secondary">Subjects</Button>
            </Link>
            <Link href="/admin/questions">
              <Button variant="secondary">Questions</Button>
            </Link>
            <Link href="/admin/analytics">
              <Button>Analytics</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="text-xs font-semibold text-white/70">Platform</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {kpis ? kpis.students : loading ? "…" : "—"}
          </div>
          <div className="mt-1 text-sm text-white/70">Registered students</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Active subjects</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {loading ? "…" : activeSubjects.length}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {activeSubjectLabels.length ? activeSubjectLabels.slice(0, 4).join(", ") : "No active subjects"}
            {activeSubjectLabels.length > 4 ? "…" : ""}
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Question bank</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {loading ? "…" : totalQuestions}
          </div>
          <div className="mt-1 text-sm text-slate-600">Total questions available</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs font-semibold text-slate-500">Attempts</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {kpis ? kpis.attempts : loading ? "…" : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-600">Total quiz submissions</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Average score</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {kpis ? `${kpis.avgScorePct}%` : loading ? "…" : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-600">Across all attempts</div>
        </Card>

        <Card className="bg-slate-50">
          <div className="text-xs font-semibold text-slate-500">Workflow</div>
          <div className="mt-2 text-lg font-extrabold text-slate-900">Subjects → Questions → Quizzes</div>
          <div className="mt-2 text-sm text-slate-600">
            Keep each active subject stocked with questions so students always see quizzes.
          </div>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <div className="text-sm font-extrabold text-slate-900">Quick actions</div>
            <div className="mt-1 text-sm text-slate-600">Add subjects, create questions, and keep quizzes ready.</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/subjects">
                <Button variant="secondary">Manage subjects</Button>
              </Link>
              <Link href="/admin/questions">
                <Button>Manage questions</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
            <div className="text-sm font-extrabold text-slate-900">Operational note</div>
            <div className="mt-1 text-sm text-slate-600">
              Students can only take quizzes for active subjects with questions. If a subject has no questions, they
              will see “No questions found”.
            </div>
            <div className="mt-4">
              <Link href="/admin/analytics" className="text-sm font-semibold text-slate-900 hover:underline">
                View platform analytics →
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
