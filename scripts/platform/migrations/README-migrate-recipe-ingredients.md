# Migration: Migrate Recipe Ingredients to Ingredients Collection

This migration script extracts ingredient data from recipes and ensures they exist in the ingredients collection. The recipe will keep only the reference to the ingredient and essential recipe-specific information.

## Purpose

Currently, recipe ingredients contain all ingredient data embedded within the recipe document. This migration:

1. Creates separate ingredient documents in the `ingredients` collection if they don't already exist
2. Updates recipe documents to contain only references to these ingredients

## Benefits

- **Normalized data structure**: Ingredients are stored once in their own collection
- **Improved data consistency**: Changes to ingredient data affect all recipes using that ingredient
- **Reduced data duplication**: Ingredient data is not duplicated across recipes

## How to Run

From the `scripts` directory:

```bash
pnpm run migrate migrate-recipe-ingredients <organizationId>
```

Replace `<organizationId>` with the target organization ID (defaults to "demo" if not specified).

### Dry Run

To perform a dry run without making any changes to the database:

```bash
pnpm run migrate migrate-recipe-ingredients <organizationId> --dry-run
```

## Schema Changes

### Before Migration

Recipe document contains full ingredient data:

```javascript
{
  "id": "recipe123",
  "name": "Chocolate Cake",
  // ... other recipe fields
  "ingredients": [
    {
      "id": "ing123",
      "name": "Flour",
      "unit": "kg",
      "pricePerUnit": 1.5,
      "pricePerProduction": 0.75,
      "quantityPerProduction": 0.5,
      // ... other ingredient fields
    }
  ]
}
```

### After Migration

Recipe document contains only ingredient references:

```javascript
{
  "id": "recipe123",
  "name": "Chocolate Cake",
  // ... other recipe fields
  "ingredients": [
    {
      "id": "ing123",
      "type": "ingredient",
      "pricePerProduction": 0.75,
      "quantityPerProduction": 0.5
    }
  ]
}
```

Ingredients collection has separate documents:

```javascript
{
  "id": "ing123",
  "name": "Flour",
  "unit": "kg",
  "pricePerUnit": 1.5,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

## Rollback

There is no automated rollback for this migration. If you need to rollback, you should restore from a backup made before running this migration.
