"use client";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

type AdminQuestion = {
  _id: string;
  subject: string;
  question: string;
  options: string[];
  correctOption: number;
  createdAt?: string;
};

type AdminSubject = {
  _id: string;
  slug: string;
  label: string;
  active: boolean;
};

type QuestionDraft = {
  question: string;
  optA: string;
  optB: string;
  optC: string;
  optD: string;
  correctOption: number;
};

function emptyDraft(): QuestionDraft {
  return {
    question: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctOption: 0
  };
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeSubjectLabels = useMemo(
    () => subjects.filter((s) => s.active).map((s) => s.label),
    [subjects]
  );

  const [subject, setSubject] = useState<string>("");
  const [drafts, setDrafts] = useState<QuestionDraft[]>([emptyDraft()]);

  const bySubject = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) map[q.subject] = (map[q.subject] ?? 0) + 1;
    return map;
  }, [questions]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const [q, s] = await Promise.all([
        apiFetch<{ questions: AdminQuestion[] }>("/api/admin/questions"),
        apiFetch<{ subjects: AdminSubject[] }>("/api/admin/subjects")
      ]);
      setQuestions(q.questions);
      setSubjects(s.subjects);

      const activeLabels = s.subjects.filter((x) => x.active).map((x) => x.label);
      setSubject((prev) => (prev && activeLabels.includes(prev) ? prev : activeLabels[0] ?? ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Questions" subtitle="Create and manage quiz questions." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Create Questions</div>
          <div className="mt-1 text-xs text-slate-500">
            Add multiple questions and submit them together.
          </div>

          {error ? (
            <Alert className="mt-4" variant="danger">
              {error}
            </Alert>
          ) : null}
          {message ? (
            <Alert className="mt-4" variant="success">
              {message}
            </Alert>
          ) : null}

          <form
            className="mt-5 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setMessage(null);

              try {
                if (!subject) throw new Error("Please create/enable a subject first.");

                const payload = {
                  subject,
                  questions: drafts.map((d) => ({
                    question: d.question,
                    options: [d.optA, d.optB, d.optC, d.optD],
                    correctOption: d.correctOption
                  }))
                };

                const res = await apiFetch<{ count: number }>("/api/admin/questions/bulk", {
                  method: "POST",
                  body: JSON.stringify(payload)
                });

                setMessage(`${res.count} question${res.count === 1 ? "" : "s"} created.`);
                setDrafts([emptyDraft()]);
                await reload();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create questions");
              }
            }}
          >
            <Select label="Subject" value={subject} onChange={(e) => setSubject(e.target.value as any)}>
              {activeSubjectLabels.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-600">Questions to create: {drafts.length}</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDrafts((prev) => [...prev, emptyDraft()])}
                >
                  Add another
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDrafts([emptyDraft()])}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-4">
              {drafts.map((d, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Question {idx + 1}</div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={drafts.length === 1}
                      onClick={() =>
                        setDrafts((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    <Input
                      label="Question"
                      value={d.question}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, question: v } : x)));
                      }}
                      placeholder="Enter your question"
                      required
                    />

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        label="Option A"
                        value={d.optA}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, optA: v } : x)));
                        }}
                        required
                      />
                      <Input
                        label="Option B"
                        value={d.optB}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, optB: v } : x)));
                        }}
                        required
                      />
                      <Input
                        label="Option C"
                        value={d.optC}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, optC: v } : x)));
                        }}
                        required
                      />
                      <Input
                        label="Option D"
                        value={d.optD}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, optD: v } : x)));
                        }}
                        required
                      />
                    </div>

                    <Select
                      label="Correct Option"
                      value={String(d.correctOption)}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDrafts((prev) => prev.map((x, i) => (i === idx ? { ...x, correctOption: v } : x)));
                      }}
                    >
                      <option value="0">A</option>
                      <option value="1">B</option>
                      <option value="2">C</option>
                      <option value="3">D</option>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={!subject}>
              Create {drafts.length > 1 ? "Questions" : "Question"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-900">Summary</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {activeSubjectLabels.map((s) => (
              <div key={s} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">{s}</div>
                <div className="text-lg font-extrabold text-slate-900">{bySubject[s] ?? 0}</div>
              </div>
            ))}
          </div>

          <Button className="mt-4 w-full" variant="secondary" onClick={() => reload()}>
            Refresh
          </Button>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">All Questions</div>
            <div className="text-xs text-slate-500">Delete outdated questions anytime.</div>
          </div>
          <div className="text-xs text-slate-500">Total: {questions.length}</div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-slate-600">Loading...</div>
        ) : questions.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600">No questions yet. Create your first question above.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="border-b border-slate-200 pb-2">Subject</th>
                  <th className="border-b border-slate-200 pb-2">Question</th>
                  <th className="border-b border-slate-200 pb-2">Correct</th>
                  <th className="border-b border-slate-200 pb-2" />
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id} className="align-top">
                    <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-900">{q.subject}</td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{q.question}</div>
                      <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600 md:grid-cols-2">
                        {q.options.map((o, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border px-2 py-1 ${
                              i === q.correctOption
                                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {o}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                      {String.fromCharCode(65 + q.correctOption)}
                    </td>
                    <td className="border-b border-slate-100 py-3">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                          setError(null);
                          setMessage(null);
                          try {
                            await apiFetch(`/api/admin/questions/${q._id}`, { method: "DELETE" });
                            setMessage("Question deleted.");
                            await reload();
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to delete question");
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
