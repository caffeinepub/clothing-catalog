import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, LogOut, Plus, Shirt } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { ClothingItem } from "../backend.d";
import {
  useDeleteClothingItem,
  useGetAllClothingItems,
} from "../hooks/useQueries";
import { ClothingCard } from "./ClothingCard";

interface ClothingCatalogProps {
  isAdmin: boolean;
  onAddItem: () => void;
  onEditItem: (item: ClothingItem) => void;
  onSignOut: () => void;
  onSignIn?: () => void;
  onViewDetail: (item: ClothingItem) => void;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function ClothingCatalog({
  isAdmin,
  onAddItem,
  onEditItem,
  onSignOut,
  onSignIn,
  onViewDetail,
}: ClothingCatalogProps) {
  const { data: items = [], isLoading } = useGetAllClothingItems();
  const deleteMutation = useDeleteClothingItem();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("DROPPED FROM THE CLOSET");
    } catch {
      toast.error("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Top accent bar */}
      <div className="h-1 bg-primary w-full" />

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center border border-primary/60">
              <Shirt className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-black tracking-tighter text-foreground uppercase">
              Dead and Worn
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Button
                  onClick={onAddItem}
                  className="gap-2 rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold px-5 h-9"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="gap-1.5 rounded-none font-sans text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Exit
                </Button>
              </>
            ) : (
              onSignIn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSignIn}
                  className="gap-1.5 rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden bg-muted/50">
        <img
          src="/assets/generated/hero-skate-2000s.dim_1200x600.jpg"
          alt="Fashion editorial"
          className="w-full h-48 sm:h-64 object-cover object-center opacity-50"
        />
        {/* Dark overlay with crosshatch texture feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-display text-3xl sm:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
              THE COLLECTION
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-sans tracking-[0.3em] uppercase">
                ✦ curated fits ✦
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-full rounded-none" />
                <Skeleton className="h-3 w-2/3 rounded-none" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState isAdmin={isAdmin} onAddItem={onAddItem} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-muted-foreground font-sans tracking-[0.2em] uppercase">
                {items.length} {items.length === 1 ? "piece" : "pieces"} in the
                closet
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div key={item.id} variants={itemVariants} layout>
                    <ClothingCard
                      item={item}
                      isAdmin={isAdmin}
                      onEdit={() => onEditItem(item)}
                      onDelete={() => handleDelete(item.id)}
                      isDeleting={deleteMutation.isPending}
                      onViewDetail={() => onViewDetail(item)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="h-px bg-primary/30 w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-xs text-muted-foreground font-sans tracking-widest uppercase mb-1">
            Kill Em' All!
          </p>
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

function EmptyState({
  isAdmin,
  onAddItem,
}: {
  isAdmin: boolean;
  onAddItem: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative mb-8">
        <div className="w-24 h-32 border-2 border-dashed border-primary/40 flex items-center justify-center bg-muted/20">
          <span className="text-primary/40 text-4xl font-display font-black select-none">
            ✦
          </span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-10 bg-primary/10 border border-primary/30" />
        <div className="absolute -bottom-2 -left-2 w-6 h-8 bg-muted/40 border border-border" />
      </div>
      <h2 className="font-display text-3xl font-black text-foreground mb-3 uppercase tracking-tighter">
        THE CLOSET IS EMPTY
      </h2>
      <p className="text-muted-foreground font-sans text-xs max-w-xs leading-relaxed mb-8 tracking-wider uppercase">
        {isAdmin
          ? "Start building your collection. Add a photo, a name, and drop the info."
          : "No pieces have been added yet. Check back soon."}
      </p>
      {isAdmin && (
        <Button
          onClick={onAddItem}
          className="gap-2 rounded-none font-sans text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 h-auto"
        >
          <Plus className="w-4 h-4" />
          Add First Piece
        </Button>
      )}
    </motion.div>
  );
}
