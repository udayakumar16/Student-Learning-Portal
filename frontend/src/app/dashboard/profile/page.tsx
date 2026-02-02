"use client";

import { Card } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

type User = {
  name: string;
  registerNumber: string;
  department: string;
  email: string;
  mobile: string;
  collegeName?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Pick<User, "name" | "department" | "mobile" | "collegeName">>({
    name: "",
    department: "",
    mobile: "",
    collegeName: ""
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ user: User }>("/api/users/me")
      .then((data) => {
        setUser(data.user);
        setDraft({
          name: data.user.name ?? "",
          department: data.user.department ?? "",
          mobile: data.user.mobile ?? "",
          collegeName: data.user.collegeName ?? ""
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Profile"
        subtitle="Your student identity and account details."
        right={
          <>
            <Link href="/dashboard/help">
              <Button variant="secondary">Support</Button>
            </Link>
            <Link href="/dashboard/assessment">
              <Button>Start Assessment</Button>
            </Link>
          </>
        }
      />

      <div className="animate-fade-up relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-soft">
        <div className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -right-20 top-8 h-80 w-80 rounded-full bg-emerald-400/18 blur-3xl animate-float" />
        <div className="pointer-events-none absolute left-1/3 -bottom-28 h-96 w-96 rounded-full bg-fuchsia-400/12 blur-3xl animate-float" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              Student profile
            </div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight">
              {user?.name ? user.name : "Loading profile…"}
            </div>
            <div className="mt-1 text-sm text-white/75">
              {user?.department ? user.department : ""}
              {user?.registerNumber ? ` • ${user.registerNumber}` : ""}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Refresh
            </Link>
            <Link
              href="/dashboard/help"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
            >
              Report an issue
            </Link>
          </div>
        </div>

        {error ? (
          <div className="relative mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
            <div className="font-semibold">Couldn’t load profile</div>
            <div className="mt-1 text-white/75">{error}</div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900">Student details</div>
              <div className="mt-1 text-sm text-slate-600">Information fetched from your account.</div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!user}
                  onClick={() => {
                    if (!user) return;
                    setSaveError(null);
                    setSaveMessage(null);
                    setDraft({
                      name: user.name ?? "",
                      department: user.department ?? "",
                      mobile: user.mobile ?? "",
                      collegeName: user.collegeName ?? ""
                    });
                    setIsEditing(true);
                  }}
                >
                  Edit details
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    disabled={saving}
                    onClick={async () => {
                      if (!user) return;
                      setSaving(true);
                      setSaveError(null);
                      setSaveMessage(null);
                      try {
                        const payload = {
                          name: draft.name.trim(),
                          department: draft.department.trim(),
                          mobile: draft.mobile.trim(),
                          collegeName: (draft.collegeName ?? "").trim() || undefined
                        };

                        const updated = await apiFetch<{ user: User }>("/api/users/me", {
                          method: "PUT",
                          body: JSON.stringify(payload)
                        });
                        if (updated.user) setUser(updated.user);
                        setSaveMessage("Profile updated successfully.");
                        setIsEditing(false);
                      } catch (err) {
                        setSaveError(err instanceof Error ? err.message : "Failed to update profile");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={saving}
                    onClick={() => {
                      setIsEditing(false);
                      setSaveError(null);
                      setSaveMessage(null);
                      if (!user) return;
                      setDraft({
                        name: user.name ?? "",
                        department: user.department ?? "",
                        mobile: user.mobile ?? "",
                        collegeName: user.collegeName ?? ""
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}

              <Link href="/dashboard/help">
                <Button variant="ghost" size="sm">
                  Support
                </Button>
              </Link>
            </div>
          </div>

          {saveError ? (
            <Alert className="mt-4" variant="danger">
              {saveError}
            </Alert>
          ) : null}
          {saveMessage ? (
            <Alert className="mt-4" variant="success">
              {saveMessage}
            </Alert>
          ) : null}

          {!user ? (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="mt-3 h-4 w-48 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : isEditing ? (
            <form
              className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Input
                label="Name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                required
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Register number</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.registerNumber}</div>
              </div>

              <Input
                label="Department"
                value={draft.department}
                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                required
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Email</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900 break-all">{user.email}</div>
              </div>

              <Input
                label="Mobile"
                value={draft.mobile}
                onChange={(e) => setDraft((d) => ({ ...d, mobile: e.target.value }))}
                required
              />

              <Input
                label="College"
                value={draft.collegeName ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, collegeName: e.target.value }))}
                placeholder="Your College"
              />
            </form>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Name</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.name}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Register number</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.registerNumber}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Department</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.department}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Email</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900 break-all">{user.email}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">Mobile</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.mobile}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">College</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{user.collegeName ?? "Your College"}</div>
              </div>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-indigo-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-14 -bottom-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="text-base font-extrabold tracking-tight text-slate-900">Account actions</div>
            <div className="mt-1 text-sm text-slate-600">Quick links for common tasks.</div>

            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard/assessment" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50">
                <div className="text-sm font-extrabold text-slate-900">Start an assessment</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Attempt MCQs per subject</div>
              </Link>

              <Link href="/dashboard/analytics" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50">
                <div className="text-sm font-extrabold text-slate-900">View analytics</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">See latest subject-wise results</div>
              </Link>

              <Link href="/dashboard/help" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm hover:bg-slate-100">
                <div className="text-sm font-extrabold text-slate-900">Support</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Report a login/quiz/profile issue</div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
