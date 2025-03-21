# Recipe Migration Script (Firestore to Trieve)

This script migrates recipe data from Firestore to Trieve. It's designed to be run once to ensure all recipes in Firestore are properly indexed in Trieve.

## Prerequisites

Before running the script, make sure you have:

1. Node.js and npm/pnpm installed
2. Access to the Firebase project with appropriate permissions
3. A valid service account JSON file placed in the `scripts` directory
4. Necessary environment variables configured

## Environment Variables

Create a `.env` file in the root of the project with the following variables (you can copy from `.env.migration.example`):

```
TRIEVE_API_KEY=your_trieve_api_key
TRIEVE_DATASET_ID=cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa
TRIEVE_SERVER_URL=https://api.trieve.ai
```

## Running the Script

1. Make sure you have the necessary dependencies installed:

```bash
pnpm install
```

2. Make the script executable (if needed):

```bash
chmod +x scripts/migrateRecipesToTrieve.ts
```

3. Run the script:

```bash
# From the project root
pnpm run migrate:recipes
```

### Advanced Options

The script supports the following command-line options:

- `--dry-run`: Run the script without making any changes to Firestore (only indexes in Trieve)
- `--batch-size <number>`: Set the batch size for processing recipes (default: 25)

Examples:

```bash
# Dry run without making changes to Firestore
pnpm run migrate:recipes -- --dry-run

# Process recipes in batches of 10
pnpm run migrate:recipes -- --batch-size 10

# Combine options
pnpm run migrate:recipes -- --dry-run --batch-size 5
```

## What the Script Does

1. Connects to Firestore using the admin SDK
2. Fetches all recipes from the `recipes` collection
3. Processes recipes in configurable batches
4. For each recipe:
    - Skips recipes that already have a `chunkId` (already indexed in Trieve)
    - Creates a new chunk in Trieve with the recipe data
    - Updates the recipe in Firestore with the new `chunkId` (unless in dry run mode)
5. Provides progress updates for each batch
6. Provides a summary of the migration process at the end

## Troubleshooting

- **Authentication Errors**: Ensure your service account JSON file is valid and has the necessary permissions
- **API Errors**: Verify that your Trieve API key is correct and has access to the specified dataset
- **Timeout Errors**: For large collections, consider reducing the batch size to avoid timeouts

## Notes

- This script is idempotent - running it multiple times won't create duplicate entries in Trieve
- Any recipes that fail to migrate will be listed in the error summary
- Use the dry run option to test the migration without updating Firestore
