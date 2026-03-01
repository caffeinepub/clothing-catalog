import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../AuthContext";

interface LoginPageProps {
  onBack?: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Slight delay for UX feel
    await new Promise((r) => setTimeout(r, 300));

    const success = login(username, password);
    if (!success) {
      setError("ACCESS DENIED — INVALID CREDENTIALS");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Top & bottom accent bars */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50" />
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-primary z-50" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans hover:text-foreground transition-colors mb-8 group tracking-[0.15em] uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary flex items-center justify-center mb-5 shadow-card-hover border border-primary/60">
            <span className="text-primary-foreground text-3xl font-display font-black select-none leading-none">
              ✦
            </span>
          </div>

          <h1 className="font-display text-4xl font-black text-foreground tracking-tighter uppercase leading-none text-center">
            Dead and Worn
          </h1>

          {/* Decorative separator */}
          <div className="flex items-center gap-2 mt-3 mb-1 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs font-sans tracking-[0.3em] uppercase select-none">
              × ∴ ×
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-xs text-muted-foreground font-sans mt-2 tracking-[0.2em] uppercase">
            Admin Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border-2 border-border shadow-card p-6 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="login-username"
                className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold"
              >
                Username
              </Label>
              <Input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username"
                className="rounded-none font-sans text-sm bg-background border-border focus:border-primary focus-visible:ring-primary/50 tracking-wider"
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="login-password"
                className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold"
              >
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="rounded-none font-sans text-sm bg-background border-border focus:border-primary focus-visible:ring-primary/50 tracking-wider"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive font-sans tracking-[0.1em] uppercase font-bold"
                role="alert"
              >
                ⬥ {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-none font-sans text-xs tracking-[0.3em] uppercase font-bold h-11 shadow-card"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating…
              </>
            ) : (
              "ENTER"
            )}
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-muted-foreground font-sans tracking-widest uppercase">
          © {new Date().getFullYear()}. Built with{" "}
          <span aria-label="love">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
