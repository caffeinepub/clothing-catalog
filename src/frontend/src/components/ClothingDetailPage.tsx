import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Pencil, Shirt, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ClothingItem } from "../backend.d";

interface ClothingDetailPageProps {
  item: ClothingItem;
  isAdmin: boolean;
  onBack: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ClothingDetailPage({
  item,
  isAdmin,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
}: ClothingDetailPageProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = item.imageBlob.getDirectURL();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 bg-primary w-full" />

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center border border-primary/60">
                <Shirt className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="font-display text-xl font-black tracking-tighter text-foreground uppercase">
                Dead and Worn
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image column */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden bg-muted/50 border border-border">
              {imgError || !imageUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-xs font-sans tracking-[0.15em] uppercase">
                    No Image
                  </span>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            {/* Decorative corner accent */}
            <div className="absolute -bottom-3 -right-3 w-16 h-20 border border-primary/20 bg-primary/5 -z-10" />
          </div>

          {/* Details column */}
          <div className="flex flex-col justify-start pt-2">
            {/* Eyebrow label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-primary" />
              <span className="text-primary text-xs font-sans tracking-[0.3em] uppercase">
                ✦ Item Details
              </span>
            </div>

            {/* Name */}
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-4">
              {item.name}
            </h2>

            {/* Price */}
            {item.price && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="mb-6"
              >
                <span className="font-sans font-black text-2xl text-accent tracking-wider">
                  ${item.price}
                </span>
              </motion.div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-border mb-6" />

            {/* Description */}
            {item.description ? (
              <p className="text-sm text-muted-foreground font-sans leading-relaxed tracking-wide whitespace-pre-wrap">
                {item.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground/50 font-sans tracking-widest uppercase italic">
                No description provided.
              </p>
            )}

            {/* Admin action buttons */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="flex gap-3 mt-10 pt-6 border-t border-border"
              >
                <Button
                  variant="outline"
                  className="gap-2 rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold flex-1"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Piece
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Drop It
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-none border-2 border-border bg-card shadow-card-hover">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display font-black uppercase tracking-tight">
                        Drop this piece?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
                        <strong className="text-foreground">{item.name}</strong>{" "}
                        will be permanently removed from the closet. This cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDelete(item.id)}
                      >
                        Drop It
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="h-px bg-primary/30 w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
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
      </footer>
    </div>
  );
}
