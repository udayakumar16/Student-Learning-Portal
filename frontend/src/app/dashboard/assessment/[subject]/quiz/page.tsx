"use client";

import { Card } from "@/components/Card";
import { apiFetch, fetchSubjects, subjectSlugToLabel, type Subject } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Question = {
  _id: string;
  subject: string;
  question: string;
  options: string[];
  correctOption: number;
};

function slugToSubjectLabel(slug: string, subjects: Subject[]) {
  return subjectSlugToLabel(slug, subjects);
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams<{ subject: string }>();
  const subjectSlug = params.subject;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsReady, setSubjectsReady] = useState(false);
  const subjectLabel = useMemo(() => subjectSlugToLabel(subjectSlug, subjects), [subjectSlug, subjects]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const selected = answers[index];

  useEffect(() => {
    let alive = true;
    fetchSubjects()
      .then((s) => {
        if (!alive) return;
        setSubjects(s);
        setSubjectsReady(true);
      })
      .catch(() => {
        if (!alive) return;
        // fall back to slug-as-label if subject list can't be fetched
        setSubjectsReady(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!subjectsReady) return;

    let alive = true;
    setLoading(true);
    setError(null);

    const effectiveSubject = slugToSubjectLabel(subjectSlug, subjects);

    apiFetch<{ questions: Question[] }>(
      `/api/questions?subject=${encodeURIComponent(effectiveSubject)}`
    )
      .then((data) => {
        if (!alive) return;
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load questions");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [subjectSlug, subjects, subjectsReady]);

  const current = questions[index];
  const total = questions.length;

  const score = useMemo(() => {
    if (!questions.length) return 0;
    return questions.reduce((acc, q, i) => (answers[i] === q.correctOption ? acc + 1 : acc), 0);
  }, [answers, questions]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={subjectLabel} subtitle="Loading questions..." />
        <Card>
          <p className="text-sm text-slate-600">Please wait a moment.</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={subjectLabel} subtitle="Unable to load questions" />
        <Card>
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={subjectLabel} subtitle="No questions found" />
        <Card>
          <p className="text-sm text-slate-600">No questions found for this subject yet.</p>
          <div className="mt-3 text-sm text-slate-600">
            Ask your admin to add questions from the admin panel.
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/admin/questions"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open Admin Panel
            </Link>
            <Link
              href="/dashboard/assessment"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isLast = index === total - 1;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={subjectLabel}
        subtitle={`Question ${index + 1} of ${total}`}
      />

      <Card>
        <div className="text-base font-bold text-slate-900">{current.question}</div>

        <div className="mt-4 flex flex-col gap-2">
          {current.options.map((opt, optIndex) => {
            const active = selected === optIndex;
            return (
              <button
                key={optIndex}
                type="button"
                className={`rounded-xl border px-4 py-3 text-left text-sm shadow-sm transition ${
                  active
                    ? "border-blue-300 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={() => {
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[index] = optIndex;
                    return next;
                  });
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 rounded-full border ${active ? "border-blue-300 bg-blue-600" : "border-slate-300"}`} />
                  <div className="flex-1">{opt}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-500">No negative marking • Submit to calculate score</div>

          {selected !== -1 ? (
            !isLast ? (
              <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
            ) : (
              <Button
                onClick={async () => {
                  const effectiveSubject = slugToSubjectLabel(subjectSlug, subjects);
                  const result = await apiFetch<{ result: { _id: string } }>("/api/results", {
                    method: "POST",
                    body: JSON.stringify({
                      subject: effectiveSubject,
                      score,
                      total
                    })
                  });

                  sessionStorage.setItem(
                    `attempt:${result.result._id}`,
                    JSON.stringify({
                      subject: effectiveSubject,
                      questions,
                      answers,
                      score,
                      total
                    })
                  );

                  router.replace(`/dashboard/result/${result.result._id}`);
                }}
              >
                Submit
              </Button>
            )
          ) : (
            <div className="text-xs text-slate-500">Select an option to continue</div>
          )}
        </div>
      </Card>
    </div>
  );
}
