"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/Card";
import { subjectSlugToLabel } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export default function InstructionsPage() {
  const params = useParams<{ subject: string }>();
  const subjectSlug = params.subject;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Instructions"
        subtitle={`Before you start: ${subjectSlugToLabel(subjectSlug)}`}
      />

      <Card>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Each subject contains MCQ questions.</li>
          <li>No negative marking.</li>
          <li>One question at a time.</li>
          <li>Next button appears only after selecting an option.</li>
          <li>Final question has a Submit button.</li>
        </ul>

        <div className="mt-5 flex gap-2">
          <Link href={`/dashboard/assessment/${subjectSlug}/quiz`}>
            <Button>Agree & Continue</Button>
          </Link>
          <Link href="/dashboard/assessment">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
