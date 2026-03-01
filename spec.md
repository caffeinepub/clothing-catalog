# Clothing Catalog

## Current State
- Backend stores clothing items with: id, name, description, imageBlob
- Frontend shows a catalog grid with add/edit/delete actions available to all visitors
- No authentication or access control exists
- No price field on items

## Requested Changes (Diff)

### Add
- A `price` field (optional Text) to ClothingItem
- A simple username/password login system on the frontend (hardcoded credentials: username=slimkid3, password=AliceInChains92)
- A `LoginPage` component shown when the user is not authenticated
- Auth state stored in sessionStorage so it persists across page refreshes but clears on tab close
- Backend `addClothingItem`, `updateClothingItem`, `deleteClothingItem` updated to accept a `price` field
- Price input field in the ClothingFormModal
- Price displayed on ClothingCard

### Modify
- `ClothingCatalog`: hide "Add Item" button and edit/delete controls when not authenticated (visitors can browse, only admin can modify)
- `ClothingFormModal`: add price field
- `ClothingCard`: display price if present; hide edit/delete buttons when not authenticated
- `App.tsx`: wrap app with auth context; show LoginPage or catalog based on auth state
- All backend mutation functions updated to include price parameter

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo`: add optional `price` field to ClothingItem, update add/update/delete functions to accept price
2. Regenerate backend bindings
3. Create `AuthContext.tsx` with login/logout state, sessionStorage persistence, and hardcoded credential check
4. Create `LoginPage.tsx` with username/password form
5. Update `App.tsx` to use AuthContext, show LoginPage when logged out
6. Update `ClothingFormModal.tsx` to include price input field
7. Update `ClothingCard.tsx` to show price, accept `isAdmin` prop to conditionally show edit/delete
8. Update `ClothingCatalog.tsx` to accept `isAdmin` prop and pass it down; hide Add Item button when not admin
9. Update `useQueries.ts` to pass price through mutations
