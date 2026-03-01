import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "./AuthContext";
import type { ClothingItem } from "./backend.d";
import { ClothingCatalog } from "./components/ClothingCatalog";
import { ClothingDetailPage } from "./components/ClothingDetailPage";
import { ClothingFormModal } from "./components/ClothingFormModal";
import { LandingChoice } from "./components/LandingChoice";
import { LoginPage } from "./components/LoginPage";
import { useDeleteClothingItem } from "./hooks/useQueries";

type AppMode = "choose" | "guest" | "admin-login";

function AppInner() {
  const { isAdmin, logout } = useAuth();
  const [mode, setMode] = useState<AppMode>("choose");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  const deleteMutation = useDeleteClothingItem();

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

  const handleSignOut = () => {
    logout();
    setMode("choose");
    setSelectedItem(null);
  };

  const handleDeleteFromDetail = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("DROPPED FROM THE CLOSET");
      setSelectedItem(null);
    } catch {
      toast.error("Failed to delete item. Please try again.");
    }
  };

  // Detail page view — shared between admin and guest
  if (selectedItem) {
    return (
      <>
        <ClothingDetailPage
          item={selectedItem}
          isAdmin={isAdmin}
          onBack={() => setSelectedItem(null)}
          onEdit={(item) => openEditModal(item)}
          onDelete={handleDeleteFromDetail}
          isDeleting={deleteMutation.isPending}
        />
        {isAdmin && (
          <ClothingFormModal
            open={isModalOpen}
            onClose={closeModal}
            editingItem={editingItem}
          />
        )}
      </>
    );
  }

  // Admin is fully authenticated — show catalog with admin controls
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ClothingCatalog
          isAdmin={true}
          onAddItem={openAddModal}
          onEditItem={openEditModal}
          onSignOut={handleSignOut}
          onViewDetail={setSelectedItem}
        />
        <ClothingFormModal
          open={isModalOpen}
          onClose={closeModal}
          editingItem={editingItem}
        />
      </div>
    );
  }

  // Landing choice screen
  if (mode === "choose") {
    return (
      <LandingChoice
        onBrowse={() => setMode("guest")}
        onAdminSignIn={() => setMode("admin-login")}
      />
    );
  }

  // Guest browse mode — read-only catalog
  if (mode === "guest") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ClothingCatalog
          isAdmin={false}
          onAddItem={() => {}}
          onEditItem={() => {}}
          onSignOut={() => {}}
          onSignIn={() => setMode("admin-login")}
          onViewDetail={setSelectedItem}
        />
      </div>
    );
  }

  // Admin login form
  return <LoginPage onBack={() => setMode("choose")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}
