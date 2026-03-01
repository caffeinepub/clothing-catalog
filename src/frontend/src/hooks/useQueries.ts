import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { ClothingItem } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllClothingItems() {
  const { actor, isFetching } = useActor();
  return useQuery<ClothingItem[]>({
    queryKey: ["clothingItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClothingItems();
    },
    enabled: !!actor && !isFetching,
  });
}

interface AddClothingItemParams {
  id: string;
  name: string;
  description: string;
  price: string | null;
  imageBlob: ExternalBlob;
}

export function useAddClothingItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      imageBlob,
    }: AddClothingItemParams) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addClothingItem(id, name, description, price, imageBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothingItems"] });
    },
  });
}

interface UpdateClothingItemParams {
  id: string;
  name: string;
  description: string;
  price: string | null;
  imageBlob: ExternalBlob;
}

export function useUpdateClothingItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      imageBlob,
    }: UpdateClothingItemParams) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateClothingItem(id, name, description, price, imageBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothingItems"] });
    },
  });
}

export function useDeleteClothingItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteClothingItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothingItems"] });
    },
  });
}
