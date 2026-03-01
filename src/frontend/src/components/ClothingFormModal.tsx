import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { ClothingItem } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useAddClothingItem, useUpdateClothingItem } from "../hooks/useQueries";

interface ClothingFormModalProps {
  open: boolean;
  onClose: () => void;
  editingItem: ClothingItem | null;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const initialFormState: FormState = {
  name: "",
  description: "",
  price: "",
  imageFile: null,
  imagePreview: null,
};

export function ClothingFormModal({
  open,
  onClose,
  editingItem,
}: ClothingFormModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevPreviewRef = useRef<string | null>(null);

  const { actor, isFetching: isActorFetching } = useActor();
  const isActorReady = !!actor && !isActorFetching;

  const addMutation = useAddClothingItem();
  const updateMutation = useUpdateClothingItem();
  const isPending = addMutation.isPending || updateMutation.isPending;

  // Initialize form when editing item changes
  useEffect(() => {
    if (!open) return;

    if (editingItem) {
      const existingUrl = editingItem.imageBlob.getDirectURL();
      setForm({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price ?? "",
        imageFile: null,
        imagePreview: existingUrl || null,
      });
    } else {
      setForm(initialFormState);
    }
    setUploadProgress(0);
  }, [open, editingItem]);

  // Revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (prevPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(prevPreviewRef.current);
      }
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous blob URL if it exists
    if (form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    const preview = URL.createObjectURL(file);
    prevPreviewRef.current = preview;
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
  };

  const clearImage = () => {
    if (form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm((prev) => ({ ...prev, imageFile: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter a name for this item");
      return;
    }

    // For a new item, image is required
    if (!editingItem && !form.imageFile) {
      toast.error("Please upload an image for this item");
      return;
    }

    try {
      setUploadProgress(0);

      let imageBlob: ExternalBlob;

      if (form.imageFile) {
        const buffer = await form.imageFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
      } else if (editingItem) {
        // No new image selected — keep existing
        imageBlob = editingItem.imageBlob as unknown as ExternalBlob;
      } else {
        toast.error("Please upload an image");
        return;
      }

      const price = form.price.trim() || null;

      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          imageBlob,
        });
        toast.success("Item updated successfully");
      } else {
        const id = crypto.randomUUID();
        await addMutation.mutateAsync({
          id,
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          imageBlob,
        });
        toast.success("Item added to your wardrobe");
      }

      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isPending) onClose();
  };

  const isEditing = !!editingItem;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-none p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-display text-lg font-bold">
            {isEditing ? "Edit Piece" : "Add New Piece"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 space-y-5">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Photo
              </Label>
              <div className="relative group">
                {form.imagePreview ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200" />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 bg-card/90 hover:bg-card border border-border rounded-none shadow-xs transition-colors"
                        aria-label="Replace image"
                      >
                        <Upload className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-1.5 bg-card/90 hover:bg-destructive hover:text-destructive-foreground border border-border rounded-none shadow-xs transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full aspect-[4/3] border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 bg-muted/30 hover:bg-muted/50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload image"
                  >
                    <div className="p-3 rounded-full bg-muted border border-border">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-sans font-medium text-foreground">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">
                        JPG, PNG, WebP, GIF
                      </p>
                    </div>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                aria-label="Upload clothing image"
              />
            </div>

            {/* Upload progress */}
            {isPending && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
                <div className="h-0.5 bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-sans">
                  Uploading… {uploadProgress}%
                </p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="item-name"
                className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Cashmere Turtleneck"
                className="rounded-none font-sans"
                autoComplete="off"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="item-price"
                className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Price
              </Label>
              <Input
                id="item-price"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="e.g. 29.99"
                className="rounded-none font-sans"
                autoComplete="off"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="item-description"
                className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Description
              </Label>
              <Textarea
                id="item-description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="e.g. Soft camel cashmere, oversized fit, perfect for layering…"
                className="rounded-none font-sans resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-none font-sans text-sm tracking-wide"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-none font-sans text-sm tracking-wide uppercase font-semibold"
              disabled={isPending || !isActorReady}
            >
              {!isActorReady ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving…" : "Adding…"}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add to Wardrobe"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
