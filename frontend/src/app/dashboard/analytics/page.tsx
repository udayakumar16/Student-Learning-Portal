"use client";

import { Card } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
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

  useEffect(() => {
    apiFetch<{ subjects: Row[] }>("/api/analytics/me")
      .then((data) => setRows(data.subjects))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics"));
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
      <PageHeader title="Analytics" subtitle="Your latest subject-wise performance (from database)." />

      <Card>
        {error ? <div className="text-sm text-red-700">{error}</div> : null}

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
