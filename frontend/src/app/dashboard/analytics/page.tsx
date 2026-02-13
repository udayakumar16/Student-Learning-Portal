"use client";

import { Card } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Row = { subject: string; score: number; total: number; createdAt: string };

export default function AnalyticsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  async function reload() {
    setError(null);
    const data = await apiFetch<{ subjects: Row[] }>("/api/analytics/me");
    setRows(data.subjects);
  }

  useEffect(() => {
    reload().catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        subject: r.subject === "Artificial Intelligence" ? "AI" : r.subject,
        score: r.score,
        total: r.total
      })),
    [rows]
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Analytics"
        subtitle="Your latest subject-wise performance (from database)."
        right={
          <Button
            variant="danger"
            disabled={resetting}
            onClick={async () => {
              const ok = window.confirm(
                "Reset analytics history?\n\nThis will delete all your saved quiz results. This cannot be undone."
              );
              if (!ok) return;

              setResetting(true);
              setError(null);
              setMessage(null);
              try {
                const r = await apiFetch<{ deletedCount: number }>("/api/results/me", { method: "DELETE" });
                setMessage(`History cleared (${r.deletedCount} result${r.deletedCount === 1 ? "" : "s"} deleted).`);
                await reload();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to reset history");
              } finally {
                setResetting(false);
              }
            }}
          >
            {resetting ? "Resetting..." : "Reset history"}
          </Button>
        }
      />

      <Card>
        {error ? <div className="text-sm text-red-700">{error}</div> : null}
        {message ? <div className="mt-2 text-sm text-emerald-700">{message}</div> : null}

        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          {rows.length ? (
            rows.map((r) => (
              <div key={r.subject} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-600">{r.subject}</div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">
                  {r.score} / {r.total}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:col-span-3">
              No attempts yet. Take an assessment to populate analytics.
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-700">Score by subject</div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="score" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}
