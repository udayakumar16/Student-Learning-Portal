"use client";

import { Card } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Attempt = {
  subject: string;
  questions: { question: string; options: string[]; correctOption: number }[];
  answers: number[];
  score: number;
  total: number;
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams<{ resultId: string }>();
  const resultId = params.resultId;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [fallbackScore, setFallbackScore] = useState<{ score: number; total: number; subject: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`attempt:${resultId}`);
    if (raw) {
      setAttempt(JSON.parse(raw) as Attempt);
      return;
    }

    apiFetch<{ results: { _id: string; subject: string; score: number; total: number }[] }>("/api/results/me")
      .then((data) => {
        const found = data.results.find((r) => r._id === resultId);
        if (found) setFallbackScore({ score: found.score, total: found.total, subject: found.subject });
      })
      .catch(() => {});
  }, [resultId]);

  const perQuestion = useMemo(() => {
    if (!attempt) return [] as { ok: boolean; question: string; chosen: string; correct: string }[];

    return attempt.questions.map((q, i) => {
      const chosenIndex = attempt.answers[i];
      const ok = chosenIndex === q.correctOption;
      return {
        ok,
        question: q.question,
        chosen: chosenIndex >= 0 ? q.options[chosenIndex] : "(no answer)",
        correct: q.options[q.correctOption]
      };
    });
  }, [attempt]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Result" subtitle="Review your score and answers." />

      <Card>
        {attempt ? (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-slate-600">Subject</div>
                <div className="text-base font-bold text-slate-900">{attempt.subject}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold text-slate-600">Total Score</div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {attempt.score} / {attempt.total}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {perQuestion.map((row, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-bold text-slate-900">
                      Q{idx + 1}. {row.question}
                    </div>
                    <Badge variant={row.ok ? "success" : "danger"}>{row.ok ? "Correct" : "Wrong"}</Badge>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    Your answer: <span className="font-semibold">{row.chosen}</span>
                  </div>
                  {!row.ok ? (
                    <div className="mt-1 text-sm text-slate-700">
                      Correct answer: <span className="font-semibold">{row.correct}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : fallbackScore ? (
          <>
            <div className="text-sm text-slate-600">Subject: {fallbackScore.subject}</div>
            <div className="mt-2 text-2xl font-bold">{fallbackScore.score} / {fallbackScore.total}</div>
            <p className="mt-2 text-sm text-slate-600">
              Detailed per-question breakdown is available immediately after submitting the quiz.
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600">Loading result...</p>
        )}

        <div className="mt-5 flex gap-2">
          <Button onClick={() => router.replace("/dashboard/assessment")}>Take another quiz</Button>
          <Button variant="secondary" onClick={() => router.replace("/dashboard/analytics")}>
            View analytics
          </Button>
        </div>
      </Card>
    </div>
  );
}
