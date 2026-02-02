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

const SUBJECTS = ["Python", "Artificial Intelligence", "DBMS"] as const;

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("Python");
  const [question, setQuestion] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOption, setCorrectOption] = useState(0);

  const bySubject = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) map[q.subject] = (map[q.subject] ?? 0) + 1;
    return map;
  }, [questions]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ questions: AdminQuestion[] }>("/api/admin/questions");
      setQuestions(data.questions);
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
          <div className="text-sm font-semibold text-slate-900">Create Question</div>
          <div className="mt-1 text-xs text-slate-500">Provide 4 options and mark the correct one.</div>

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
                await apiFetch("/api/admin/questions", {
                  method: "POST",
                  body: JSON.stringify({
                    subject,
                    question,
                    options: [optA, optB, optC, optD],
                    correctOption
                  })
                });

                setMessage("Question created.");
                setQuestion("");
                setOptA("");
                setOptB("");
                setOptC("");
                setOptD("");
                setCorrectOption(0);
                await reload();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create question");
              }
            }}
          >
            <Select label="Subject" value={subject} onChange={(e) => setSubject(e.target.value as any)}>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <Input
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
              required
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input label="Option A" value={optA} onChange={(e) => setOptA(e.target.value)} required />
              <Input label="Option B" value={optB} onChange={(e) => setOptB(e.target.value)} required />
              <Input label="Option C" value={optC} onChange={(e) => setOptC(e.target.value)} required />
              <Input label="Option D" value={optD} onChange={(e) => setOptD(e.target.value)} required />
            </div>

            <Select
              label="Correct Option"
              value={String(correctOption)}
              onChange={(e) => setCorrectOption(Number(e.target.value))}
            >
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </Select>

            <Button type="submit">Create</Button>
          </form>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-900">Summary</div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {SUBJECTS.map((s) => (
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
