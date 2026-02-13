"use client";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

type AdminSubject = {
  _id: string;
  slug: string;
  label: string;
  active: boolean;
  createdAt?: string;
};

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ subjects: AdminSubject[] }>("/api/admin/subjects");
      setSubjects(data.subjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subjects");
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
      <PageHeader title="Subjects" subtitle="Add subjects you want to appear in the student portal." />

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="text-sm font-semibold text-slate-900">Add Subject</div>
          <div className="mt-1 text-xs text-slate-500">Example: Operating Systems, Networks, Java, Maths</div>

          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setError(null);
              setMessage(null);

              try {
                await apiFetch("/api/admin/subjects", {
                  method: "POST",
                  body: JSON.stringify({ label })
                });
                setLabel("");
                setMessage("Subject added.");
                await reload();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to add subject");
              } finally {
                setSaving(false);
              }
            }}
          >
            <Input label="Subject name" value={label} onChange={(e) => setLabel(e.target.value)} required />
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add"}
            </Button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Note: After adding a subject, you can create questions for it in the Questions page.
            Deleting a subject here will hide it from students (soft delete).
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">All Subjects</div>
              <div className="text-xs text-slate-500">Active subjects are shown to students.</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => reload()}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Loading...</div>
          ) : subjects.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">No subjects yet.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="border-b border-slate-200 pb-2">Name</th>
                    <th className="border-b border-slate-200 pb-2">Slug</th>
                    <th className="border-b border-slate-200 pb-2">Status</th>
                    <th className="border-b border-slate-200 pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s._id} className="align-top">
                      <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-900">{s.label}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">{s.slug}</td>
                      <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                        {s.active ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="border-b border-slate-100 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          {s.active ? (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={mutatingId === s._id}
                              onClick={async () => {
                                const ok = window.confirm(
                                  `Delete subject "${s.label}"?\n\nThis will hide it from students. Existing questions/results remain. You can re-enable it later.`
                                );
                                if (!ok) return;

                                setError(null);
                                setMessage(null);
                                setMutatingId(s._id);
                                try {
                                  await apiFetch(`/api/admin/subjects/${s._id}`, { method: "DELETE" });
                                  setMessage("Subject deleted (hidden from students).");
                                  await reload();
                                } catch (err) {
                                  setError(err instanceof Error ? err.message : "Failed to delete subject");
                                } finally {
                                  setMutatingId(null);
                                }
                              }}
                            >
                              {mutatingId === s._id ? "Deleting..." : "Delete"}
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={mutatingId === s._id}
                              onClick={async () => {
                                setError(null);
                                setMessage(null);
                                setMutatingId(s._id);
                                try {
                                  await apiFetch("/api/admin/subjects", {
                                    method: "POST",
                                    body: JSON.stringify({ label: s.label })
                                  });
                                  setMessage("Subject enabled.");
                                  await reload();
                                } catch (err) {
                                  setError(err instanceof Error ? err.message : "Failed to enable subject");
                                } finally {
                                  setMutatingId(null);
                                }
                              }}
                            >
                              {mutatingId === s._id ? "Enabling..." : "Enable"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
