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
}

export function ClothingCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
  isDeleting,
}: ClothingCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = item.imageBlob.getDirectURL();

  return (
    <motion.article
      className="group bg-card shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/50">
        {imgError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs font-sans">
              No image
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
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="secondary"
                className="w-7 h-7 rounded-none bg-card/90 hover:bg-card border border-border shadow-xs"
                onClick={onEdit}
                aria-label={`Edit ${item.name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-7 h-7 rounded-none bg-card/90 hover:bg-destructive hover:text-destructive-foreground border border-border shadow-xs"
                    aria-label={`Delete ${item.name}`}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Remove this piece?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-sans">
                      <strong className="text-foreground">{item.name}</strong>{" "}
                      will be permanently removed from your wardrobe. This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none font-sans">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-none font-sans bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={onDelete}
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-base text-foreground leading-tight truncate mb-1">
          {item.name}
        </h3>

        {/* Price */}
        {item.price && (
          <p className="text-sm font-sans font-semibold text-muted-foreground mb-1">
            ${item.price}
          </p>
        )}

        {item.description && (
          <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Mobile edit/delete — only for admins */}
        {isAdmin && (
          <div className="flex gap-2 mt-3 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 rounded-none text-xs font-sans"
              onClick={onEdit}
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 rounded-none text-xs font-sans border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Remove this piece?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-sans">
                    <strong className="text-foreground">{item.name}</strong>{" "}
                    will be permanently removed. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-none font-sans">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-none font-sans bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onDelete}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.article>
  );
}
