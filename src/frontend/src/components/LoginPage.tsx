import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../AuthContext";

export function LoginPage() {
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
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Subtle background texture strip */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary/10" />
        <div className="absolute right-0 top-0 w-1 h-full bg-primary/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 shadow-card">
            <Shirt className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            My Wardrobe
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Sign in to manage your collection
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border border-border shadow-card p-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="login-username"
                className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
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
                placeholder="Enter your username"
                className="rounded-none font-sans"
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="login-password"
                className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
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
                placeholder="Enter your password"
                className="rounded-none font-sans"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive font-sans"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-none font-sans text-sm tracking-wide uppercase font-semibold h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs text-muted-foreground font-sans">
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
