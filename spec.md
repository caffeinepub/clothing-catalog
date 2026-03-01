# Dead and Worn

## Current State
Full-stack clothing catalog with admin login (slimkid3/AliceInChains92), guest browse mode, landing choice page, item detail pages, and a ClothingFormModal for add/edit. The `useActor` hook initializes an ICP actor asynchronously via React Query; `useAddClothingItem` and `useUpdateClothingItem` check `if (!actor) throw new Error("Actor not available")`. If the actor hasn't resolved when the admin submits the form, the add/edit silently fails or throws.

## Requested Changes (Diff)

### Add
- Actor readiness guard in `ClothingFormModal`: disable the submit button and show a loading state while actor is still initializing (`isFetching` is true or `actor` is null)
- Actor readiness guard in `useAddClothingItem` and `useUpdateClothingItem`: wait for actor before mutating, or surface a clear error

### Modify
- `useQueries.ts`: expose `isFetching` from `useActor` in mutation hooks so callers can check if actor is ready
- `ClothingFormModal.tsx`: import `useActor` hook and disable submit + show spinner while actor is not ready
- `ClothingCatalog.tsx`: pre-warm the actor on mount so it is ready when admin opens the form (no cold start delay)

### Remove
- Nothing removed

## Implementation Plan
1. In `useQueries.ts`, update `useAddClothingItem` and `useUpdateClothingItem` to also return `isActorReady` flag based on whether actor exists and is not fetching
2. In `ClothingFormModal.tsx`, call `useActor()` directly to get actor readiness; disable submit button and show "Loading..." while actor is initializing
3. Ensure `ClothingCatalog.tsx` calls `useGetAllClothingItems` (already does) which triggers actor initialization eagerly on catalog mount, pre-warming before the modal is opened
