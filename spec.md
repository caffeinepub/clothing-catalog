# Clothing Catalog

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A clothing catalog app where users can add clothing items with a photo, name, and description
- Ability to view all clothing items in a grid/gallery layout
- Ability to add new clothing items via a form (name, description, image upload)
- Ability to edit existing clothing items
- Ability to delete clothing items
- Image storage for clothing photos

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select blob-storage component for image uploads
2. Generate Motoko backend with:
   - ClothingItem type: id, name, description, imageId
   - CRUD operations: addItem, getItems, getItem, updateItem, deleteItem
3. Frontend:
   - Home page: grid gallery of all clothing items (photo, name, description)
   - Add/Edit form: name field, description field, image upload
   - Delete button per item
   - Empty state when no items exist
