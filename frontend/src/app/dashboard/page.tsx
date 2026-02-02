"use client";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { apiFetch, SUBJECTS } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

type User = { name: string; email: string };
type AnalyticsRow = { subject: string; score: number; total: number; createdAt: string };
type ResultRow = { subject: string; score: number; total: number; createdAt: string };

function formatRelativeDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHours < 24) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [recentResults, setRecentResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      apiFetch<{ user: User }>("/api/users/me"),
      apiFetch<{ subjects: AnalyticsRow[] }>("/api/analytics/me"),
      apiFetch<{ results: ResultRow[] }>("/api/results/me")
    ])
      .then((results) => {
        if (!active) return;
        const [u, a, r] = results;
        if (u.status === "fulfilled") setUser(u.value.user);
        if (a.status === "fulfilled") setAnalytics(a.value.subjects);
        if (r.status === "fulfilled") setRecentResults(r.value.results.slice(0, 3));

        const anyRejected = results.some((x) => x.status === "rejected");
        if (anyRejected) setError("Some dashboard data failed to load. You can still continue.");
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load dashboard.");
      });

    return () => {
      active = false;
    };
  }, []);

  const greetingName = useMemo(() => {
    if (!user?.name) return "";
    return user.name.split(" ")[0] || user.name;
  }, [user]);

  const latestScore = useMemo(() => {
    if (!analytics.length) return null;
    const best = analytics
      .map((r) => ({ ...r, pct: r.total ? Math.round((r.score / r.total) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct)[0];
    return best ?? null;
  }, [analytics]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={greetingName ? `Welcome, ${greetingName}` : "Student Dashboard"}
        subtitle="Your learning hub — assessments, progress, and support in one place."
        right={
          <>
            <Link href="/dashboard/analytics">
              <Button variant="secondary">Analytics</Button>
            </Link>
            <Link href="/dashboard/assessment">
              <Button>Start Assessment</Button>
            </Link>
          </>
        }
      />

      {error ? (
        <div className="animate-fade-up rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <div className="animate-fade-up relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-soft">
        <div className="pointer-events-none absolute -left-14 -top-16 h-64 w-64 rounded-full bg-indigo-500/35 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-float" />

        <div className="relative">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            Student portal
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">Ready for your next quiz?</div>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                Pick a subject, attempt a quick quiz, then review results and analytics. If you face any issue, Support is one click away.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link href="/dashboard/assessment">
                  <Button className="bg-white text-slate-900 hover:bg-white/90">Start now</Button>
                </Link>
                <Link href="/dashboard/help">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Support
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-semibold text-white/70">Progress snapshot</div>
              <div className="mt-2 text-3xl font-extrabold">
                {analytics.length ? analytics.length : "0"}
              </div>
              <div className="mt-1 text-sm text-white/75">Subjects attempted</div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-white/70">Best recent score</div>
                <div className="mt-1 text-sm text-white/85">
                  {latestScore ? (
                    <>
                      <span className="font-semibold text-white">{latestScore.subject}</span>
                      <span className="text-white/70"> · </span>
                      <span className="font-semibold text-white">{Math.round((latestScore.score / latestScore.total) * 100)}%</span>
                      <span className="text-white/70"> ({latestScore.score}/{latestScore.total})</span>
                    </>
                  ) : (
                    <span className="text-white/70">No attempts yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="animate-fade-up anim-delay-1">
          <div className="text-xs font-semibold text-slate-500">Quick start</div>
          <div className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">Assessment</div>
          <p className="mt-1 text-sm text-slate-600">Attempt subject-wise quizzes.</p>
          <div className="mt-4">
            <Link href="/dashboard/assessment">
              <Button variant="secondary" size="sm">
                Choose subject
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="animate-fade-up anim-delay-2">
          <div className="text-xs font-semibold text-slate-500">Track</div>
          <div className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">Analytics</div>
          <p className="mt-1 text-sm text-slate-600">See your latest performance from database.</p>
          <div className="mt-4">
            <Link href="/dashboard/analytics">
              <Button variant="secondary" size="sm">
                View charts
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="animate-fade-up anim-delay-3">
          <div className="text-xs font-semibold text-slate-500">Account</div>
          <div className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">Profile</div>
          <p className="mt-1 text-sm text-slate-600">Check your registered student details.</p>
          <div className="mt-4">
            <Link href="/dashboard/profile">
              <Button variant="secondary" size="sm">
                Open profile
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="animate-fade-up anim-delay-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-white/10">
          <div className="text-xs font-semibold text-white/70">Support</div>
          <div className="mt-2 text-lg font-extrabold tracking-tight">Need help?</div>
          <p className="mt-1 text-sm text-white/75">Report issues or request updates.</p>
          <div className="mt-4">
            <Link href="/dashboard/help">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90">
                Open support
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900">Recent results</div>
              <div className="mt-1 text-sm text-slate-600">Your latest attempts (most recent first).</div>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            {recentResults.length ? (
              recentResults.map((r) => (
                <div
                  key={`${r.subject}-${r.createdAt}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{r.subject}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">{formatRelativeDate(r.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500">Score</div>
                      <div className="mt-1 text-lg font-extrabold text-slate-900">
                        {r.score} / {r.total}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No attempts yet. Start an assessment to create your first result.
              </div>
            )}
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="text-base font-extrabold tracking-tight text-slate-900">Support center</div>
            <div className="mt-1 text-sm text-slate-600">
              Tell us what went wrong — login issues, quiz problems, profile updates, or anything else.
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-700">Tips</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Use clear subject + description for faster resolution.</li>
                <li>If a quiz shows no questions, try again later.</li>
                <li>For admin-only issues, contact your coordinator.</li>
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/dashboard/help">
                <Button>Open support</Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="secondary">Update profile</Button>
              </Link>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-500">Suggested subjects</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/dashboard/assessment/${s.slug}/instructions`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
