import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { FormField } from "@/ui/FormField";
import "@/pages/auth/authPages.css";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";

function getFromPath(state: unknown): string | null {
  if (!state || typeof state !== "object") return null;
  const s = state as { from?: { pathname?: string } };
  return s.from?.pathname ?? null;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => getFromPath(location.state), [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(fromPath ?? "/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card authCard">
      <div className="stack">
        <div>
          <h2 className="pageTitle">Log in</h2>
          <div className="muted">Use your account to continue.</div>
        </div>

        <form className="stack" onSubmit={onSubmit}>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />

          {error ? <div className="error">{error}</div> : null}

          <button className="btn primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="muted">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

