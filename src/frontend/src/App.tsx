import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import type { ClothingItem } from "./backend.d";
import { ClothingCatalog } from "./components/ClothingCatalog";
import { ClothingFormModal } from "./components/ClothingFormModal";
import { LoginPage } from "./components/LoginPage";

function AppInner() {
  const { isAdmin, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  if (!isAdmin) {
    return <LoginPage />;
  }

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
      <ClothingCatalog
        isAdmin={isAdmin}
        onAddItem={openAddModal}
        onEditItem={openEditModal}
        onSignOut={logout}
      />

      <ClothingFormModal
        open={isModalOpen}
        onClose={closeModal}
        editingItem={editingItem}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}
