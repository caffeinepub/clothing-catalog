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
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ClothingItem } from "../backend.d";

interface ClothingCardProps {
  item: ClothingItem;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  onViewDetail: () => void;
}

export function ClothingCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
  isDeleting,
  onViewDetail,
}: ClothingCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = item.imageBlob.getDirectURL();

  return (
    <motion.article
      className="group bg-card shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden border border-border hover:border-primary/50"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Image — clickable to view detail */}
      <button
        type="button"
        className="relative w-full aspect-[3/4] overflow-hidden bg-muted/50 cursor-pointer block text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        onClick={onViewDetail}
        aria-label={`View details for ${item.name}`}
      >
        {imgError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-muted border-b border-border">
            <span className="text-muted-foreground text-xs font-sans tracking-[0.15em] uppercase">
              No Image
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Action overlay — only for admins */}
        {isAdmin && (
          <>
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-background/30 transition-colors duration-300" />
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="secondary"
                className="w-7 h-7 rounded-none bg-card/95 hover:bg-card border border-border shadow-xs hover:border-primary/50"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label={`Edit ${item.name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-7 h-7 rounded-none bg-card/95 hover:bg-destructive hover:text-destructive-foreground border border-border shadow-xs hover:border-destructive"
                    aria-label={`Delete ${item.name}`}
                    disabled={isDeleting}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
                      onClick={onDelete}
                    >
                      Drop It
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </button>

      {/* Info — clickable to view detail */}
      <button
        type="button"
        className="w-full p-4 border-t border-border/60 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        onClick={onViewDetail}
        aria-label={`View details for ${item.name}`}
      >
        <h3 className="font-display font-black text-base text-foreground leading-tight truncate mb-1 uppercase tracking-tight">
          {item.name}
        </h3>

        {/* Price */}
        {item.price && (
          <p className="text-sm font-sans font-bold text-accent mb-1 tracking-wider">
            ${item.price}
          </p>
        )}

        {item.description && (
          <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed tracking-wide">
            {item.description}
          </p>
        )}
      </button>

      {/* Mobile edit/delete — only for admins */}
      {isAdmin && (
        <div className="flex gap-2 px-4 pb-4 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 rounded-none text-xs font-sans tracking-[0.1em] uppercase font-bold"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 rounded-none text-xs font-sans tracking-[0.1em] uppercase font-bold border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                disabled={isDeleting}
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-3 h-3" />
                Drop
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-2 border-border bg-card shadow-card-hover">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display font-black uppercase tracking-tight">
                  Drop this piece?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  <strong className="text-foreground">{item.name}</strong> will
                  be permanently removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-none font-sans text-xs tracking-[0.15em] uppercase font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Drop It
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </motion.article>
  );
}
