import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { ClothingItem } from "./backend.d";
import { ClothingCatalog } from "./components/ClothingCatalog";
import { ClothingFormModal } from "./components/ClothingFormModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ClothingItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClothingCatalog onAddItem={openAddModal} onEditItem={openEditModal} />

      <ClothingFormModal
        open={isModalOpen}
        onClose={closeModal}
        editingItem={editingItem}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
