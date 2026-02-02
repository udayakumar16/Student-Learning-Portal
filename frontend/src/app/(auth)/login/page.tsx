import { LoginClient } from "@/app/(auth)/login/LoginClient";

export default function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const nextPathRaw = searchParams?.next;
  const nextPath = typeof nextPathRaw === "string" ? nextPathRaw : undefined;
  const modeRaw = searchParams?.mode;
  const mode = typeof modeRaw === "string" ? modeRaw : undefined;
  return <LoginClient nextPath={nextPath} mode={mode} />;
}
