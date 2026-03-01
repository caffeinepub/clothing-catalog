import { Eye, LogIn } from "lucide-react";
import { motion } from "motion/react";

interface LandingChoiceProps {
  onBrowse: () => void;
  onAdminSignIn: () => void;
}

export function LandingChoice({ onBrowse, onAdminSignIn }: LandingChoiceProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Top & bottom border bars — aggressive full-width chrome */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50" />
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-primary z-50" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-10">
          {/* Decorative skull-like glyph box */}
          <div className="w-16 h-16 bg-primary flex items-center justify-center mb-5 shadow-card-hover border border-primary/60">
            <span className="text-primary-foreground text-3xl font-display font-black select-none leading-none">
              ✦
            </span>
          </div>

          <h1 className="font-display text-5xl font-black text-foreground tracking-tighter uppercase leading-none text-center">
            Dead and Worn
          </h1>

          {/* Decorative separator */}
          <div className="flex items-center gap-2 mt-3 mb-1 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs font-sans tracking-[0.3em] uppercase select-none">
              ✦ × ✦
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-sm text-muted-foreground font-sans mt-2 text-center tracking-[0.15em] uppercase">
            Kill Em' All!
          </p>
        </div>

        {/* Choice Cards */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button
              type="button"
              onClick={onBrowse}
              className="w-full group bg-card border-2 border-border hover:border-primary shadow-card hover:shadow-card-hover p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-display text-lg font-black text-foreground tracking-tight uppercase">
                    Browse Collection
                  </p>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed tracking-wider uppercase">
                    View all pieces — no login needed
                  </p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button
              type="button"
              onClick={onAdminSignIn}
              className="w-full group bg-card border-2 border-border hover:border-primary shadow-card hover:shadow-card-hover p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                  <LogIn className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-display text-lg font-black text-foreground tracking-tight uppercase">
                    Admin Sign In
                  </p>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed tracking-wider uppercase">
                    Manage your collection
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-xs text-muted-foreground font-sans mt-8 tracking-[0.2em] uppercase"
        >
          ∴ select your path ∴
        </motion.p>
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
