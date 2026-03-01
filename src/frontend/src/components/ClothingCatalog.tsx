import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Plus, Shirt } from "lucide-react";
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
}: ClothingCatalogProps) {
  const { data: items = [], isLoading } = useGetAllClothingItems();
  const deleteMutation = useDeleteClothingItem();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Item removed from your wardrobe");
    } catch {
      toast.error("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Shirt className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              My Wardrobe
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <Button
                  onClick={onAddItem}
                  className="gap-2 rounded-none font-sans text-sm tracking-wide uppercase font-semibold px-5"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="gap-1.5 rounded-none font-sans text-xs text-muted-foreground hover:text-foreground"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden bg-muted/50">
        <img
          src="/assets/generated/hero-wardrobe.dim_1200x600.jpg"
          alt="Fashion editorial"
          className="w-full h-48 sm:h-64 object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
          >
            Your Personal Collection
          </motion.p>
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
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState isAdmin={isAdmin} onAddItem={onAddItem} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground font-sans tracking-wide">
                {items.length} {items.length === 1 ? "piece" : "pieces"} in your
                collection
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
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
        <div className="w-24 h-32 border-2 border-dashed border-border rounded-none flex items-center justify-center bg-muted/40">
          <Shirt
            className="w-8 h-8 text-muted-foreground/50"
            strokeWidth={1.5}
          />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-10 bg-accent/30 border border-accent/50 rounded-none" />
        <div className="absolute -bottom-2 -left-2 w-6 h-8 bg-secondary/60 border border-border rounded-none" />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-3">
        Your wardrobe is empty
      </h2>
      <p className="text-muted-foreground font-sans text-sm max-w-xs leading-relaxed mb-8">
        {isAdmin
          ? "Start building your personal collection by adding your first clothing piece — a photo, a name, and a few words about it."
          : "No pieces have been added to the collection yet."}
      </p>
      {isAdmin && (
        <Button
          onClick={onAddItem}
          className="gap-2 rounded-none font-sans text-sm tracking-wide uppercase font-semibold px-6 py-3 h-auto"
        >
          <Plus className="w-4 h-4" />
          Add Your First Piece
        </Button>
      )}
    </motion.div>
  );
}
