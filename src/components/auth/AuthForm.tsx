
import { SecureAuthForm } from "./SecureAuthForm";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  return <SecureAuthForm mode={mode} />;
}
