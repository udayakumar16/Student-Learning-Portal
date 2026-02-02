"use client";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type AdminAnalyticsResponse = {
  kpis: {
    students: number;
    attempts: number;
    avgScorePct: number;
  };
  bySubject: Array<{ subject: string; attempts: number; avgScorePct: number }>;
  topStudents: Array<{
    userId: string;
    name: string;
    registerNumber: string;
    department: string;
    attempts: number;
    avgScorePct: number;
    lastAttemptAt: string;
  }>;
  recentAttempts: Array<{
    id: string;
    user: { id: string; name: string; registerNumber: string; department: string };
    subject: string;
    score: number;
    total: number;
    createdAt: string;
  }>;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function pct(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 1000) / 10;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<AdminAnalyticsResponse>("/api/admin/analytics");
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subjectChartData = useMemo(() => {
    const rows = data?.bySubject ?? [];
    return rows.map((r) => ({
      subject: r.subject,
      attempts: r.attempts,
      avg: r.avgScorePct
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Student Analytics" subtitle="Platform-wide performance and recent attempts." />

      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="text-xs font-semibold text-white/70">Students</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">{data?.kpis.students ?? "—"}</div>
          <div className="mt-1 text-sm text-white/70">Total registered students</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Attempts</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{data?.kpis.attempts ?? "—"}</div>
          <div className="mt-1 text-sm text-slate-600">Total quiz attempts</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500">Average score</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {data ? `${data.kpis.avgScorePct}%` : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-600">Across all student attempts</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Attempts by subject</div>
              <div className="text-xs text-slate-500">Volume and average performance</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => reload()}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Loading...</div>
          ) : subjectChartData.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">No results yet.</div>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 8, right: 10, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} interval={0} angle={-10} height={50} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "avg") return [`${value}%`, "Avg score"];
                      return [value, "Attempts"];
                    }}
                  />
                  <Bar dataKey="attempts" fill="#0f172a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {(data?.bySubject ?? []).map((r) => (
                  <div key={r.subject} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-sm font-semibold text-slate-900">{r.subject}</div>
                    <div className="text-xs text-slate-600">
                      {r.attempts} attempts • avg {r.avgScorePct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="text-sm font-semibold text-slate-900">Top active students</div>
          <div className="mt-1 text-xs text-slate-500">Sorted by activity (attempts) and average score</div>

          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Loading...</div>
          ) : (data?.topStudents?.length ?? 0) === 0 ? (
            <div className="mt-4 text-sm text-slate-600">No student activity yet.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="border-b border-slate-200 pb-2">Student</th>
                    <th className="border-b border-slate-200 pb-2">Reg No</th>
                    <th className="border-b border-slate-200 pb-2">Attempts</th>
                    <th className="border-b border-slate-200 pb-2">Avg</th>
                    <th className="border-b border-slate-200 pb-2">Last</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.topStudents ?? []).map((s) => (
                    <tr key={s.userId} className="align-top">
                      <td className="border-b border-slate-100 py-3 pr-4">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.department}</div>
                      </td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{s.registerNumber}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-900">{s.attempts}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{s.avgScorePct}%</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-xs text-slate-600">
                        {formatDateTime(s.lastAttemptAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Recent attempts</div>
            <div className="text-xs text-slate-500">Latest student quiz submissions</div>
          </div>
          <div className="text-xs text-slate-500">Showing {data?.recentAttempts?.length ?? 0}</div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-slate-600">Loading...</div>
        ) : (data?.recentAttempts?.length ?? 0) === 0 ? (
          <div className="mt-4 text-sm text-slate-600">No attempts yet.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="border-b border-slate-200 pb-2">When</th>
                  <th className="border-b border-slate-200 pb-2">Student</th>
                  <th className="border-b border-slate-200 pb-2">Reg No</th>
                  <th className="border-b border-slate-200 pb-2">Subject</th>
                  <th className="border-b border-slate-200 pb-2">Score</th>
                  <th className="border-b border-slate-200 pb-2">%</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentAttempts ?? []).map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="border-b border-slate-100 py-3 pr-4 text-xs text-slate-600">
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-4">
                      <div className="font-semibold text-slate-900">{r.user.name}</div>
                      <div className="text-xs text-slate-500">{r.user.department}</div>
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{r.user.registerNumber}</td>
                    <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-900">{r.subject}</td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                      {r.score}/{r.total}
                    </td>
                    <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{pct(r.score, r.total)}%</td>
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
