"use client";

import { Card } from "@/components/Card";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type User = { name: string; email: string };

const ISSUE_TYPES = ["Login Issue", "Quiz Problem", "Profile Update", "Other"] as const;

export default function HelpPage() {
  const [user, setUser] = useState<User | null>(null);
  const [issueType, setIssueType] = useState<(typeof ISSUE_TYPES)[number]>("Login Issue");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ user: User }>("/api/users/me")
      .then((data) => setUser({ name: data.user.name, email: data.user.email }))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Need Help" subtitle="Submit a support request. We'll get back to you." />

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-semibold text-slate-600">Student Name</div>
            <div className="text-sm font-bold">{user?.name ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-semibold text-slate-600">Email</div>
            <div className="text-sm font-bold">{user?.email ?? "—"}</div>
          </div>
        </div>

        {error ? <Alert className="mt-4" variant="danger">{error}</Alert> : null}
        {message ? <Alert className="mt-4" variant="success">{message}</Alert> : null}

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setMessage(null);
            try {
              await apiFetch("/api/support", {
                method: "POST",
                body: JSON.stringify({ issueType, subject, description })
              });
              setMessage("Support request submitted successfully.");
              setSubject("");
              setDescription("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to submit request");
            }
          }}
        >
          <Select
            label="Issue Type"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as any)}
          >
            {ISSUE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Login / Python quiz / Profile"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue clearly..."
            required
          />

          <Button className="mt-2" type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
