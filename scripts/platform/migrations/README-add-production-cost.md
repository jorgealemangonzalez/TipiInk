# Add Production Cost Migration

This migration script adds the `productionCost` field to all existing recipes in the Firestore database.

## Background

The `productionCost` is calculated based on recipe ingredients and is used for various price calculations.
This field was recently added to the `RecipeDBModel` but existing recipes in the database may not have
this field populated yet.

## What This Migration Does

1. Retrieves all recipes for a specified organization
2. Calculates the production cost for each recipe based on its ingredients
3. Updates each recipe with the calculated production cost
4. Skips recipes that already have the correct production cost value
5. Provides a summary of the migration process

## Prerequisites

- Firebase application default credentials set up
    - If running locally against emulators, no additional setup is needed
    - If running against production, run `gcloud auth application-default login` first
- Node.js and pnpm installed

## Usage

Run the migration with:

```bash
# From the root of the project
pnpm --filter scripts run migrate add-production-cost [organizationId]
```

Where `organizationId` is the ID of the organization to migrate recipes for. If not provided, it defaults to "demo".

### Run Against Production

To run this migration against the production environment:

```bash
pnpm --filter scripts run migrate add-production-cost [organizationId] --prod
```

### Dry Run

You can perform a dry run to see what changes would be made without actually modifying the database:

```bash
pnpm --filter scripts run migrate add-production-cost [organizationId] --dry-run
```

## Example

```bash
# Migrate all recipes in the "demo" organization (local environment)
pnpm --filter scripts run migrate add-production-cost demo

# Dry run for the "demo" organization against production
pnpm --filter scripts run migrate add-production-cost demo --dry-run --prod
```

## Notes

- The migration calculates production cost using the same algorithm as the application
- Any recipe with a missing or incorrect production cost will be updated
- The `updatedAt` timestamp will be updated for all modified recipes
- If running against emulators, make sure they are running before executing the migration
