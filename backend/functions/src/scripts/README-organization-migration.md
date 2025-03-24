# Recipe Organization Migration Script

This script migrates recipe data from the root-level `recipes` collection to the `organizations/{organizationId}/recipes` subcollection. It's designed to be run once to ensure all recipes are properly moved to the organization structure.

## Prerequisites

Before running the script, make sure you have:

1. Node.js and npm/pnpm installed
2. Access to the Firebase project with appropriate permissions
3. A valid service account JSON file (or application default credentials configured)
4. For local development, Firebase emulators running on the default ports

## Running the Script

1. Make sure you have the necessary dependencies installed:

```bash
pnpm install
```

2. Make the script executable (if needed):

```bash
chmod +x scripts/migrateRecipesToOrganization.ts
```

3. Run the script:

```bash
# From the project root
pnpm run migrate:recipes:org -- --prod
```

### Advanced Options

The script supports the following command-line options:

- `--dry-run`: Run the script without making any changes to Firestore
- `--batch-size <number>`: Set the batch size for processing recipes (default: 25)
- `--org-id <string>`: Set the organization ID (default: "demo")
- `--prod`: Connect to the production Firebase environment
- `--local`: Connect to local Firebase emulators (this is the default if --prod is not specified)

Examples:

```bash
# Dry run in production without making changes to Firestore
pnpm run migrate:recipes:org -- --dry-run --prod

# Process recipes in batches of 10 in production
pnpm run migrate:recipes:org -- --batch-size 10 --prod

# Migrate to a different organization ID in production
pnpm run migrate:recipes:org -- --org-id myorganization --prod

# Run against local emulators (explicitly)
pnpm run migrate:recipes:org -- --local

# Combine options
pnpm run migrate:recipes:org -- --dry-run --batch-size 5 --org-id test --prod
```

## What the Script Does

1. Connects to Firestore using the admin SDK (production or emulator based on flags)
2. Fetches all recipes from the `recipes` collection
3. Processes recipes in configurable batches
4. For each recipe:
    - Skips recipes that already exist in the target collection
    - Copies the recipe data to the new location in `organizations/{organizationId}/recipes`
5. Provides progress updates for each batch
6. Provides a summary of the migration process at the end

## Troubleshooting

- **Authentication Errors**: For production, ensure you're authenticated with `gcloud auth application-default login`
- **Permission Errors**: Verify that your account has write access to both the source and target collections
- **Timeout Errors**: For large collections, consider reducing the batch size to avoid timeouts
- **Emulator Connection**: When using `--local`, ensure your emulators are running on the default ports (Firestore: 5003, Auth: 5004)

## Notes

- This script is idempotent - running it multiple times won't create duplicate entries
- Any recipes that fail to migrate will be listed in the error summary
- Use the dry run option to test the migration without making changes to Firestore
- The script does not delete the original recipes from the root collection
