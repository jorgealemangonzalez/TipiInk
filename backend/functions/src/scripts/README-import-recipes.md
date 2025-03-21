# Recipe Import Script

This script imports recipes from the source `recipes.ts` file into the Firestore database in the production environment by calling the `createRecipe` cloud function.

## Prerequisites

- Node.js 20 or later
- `pnpm` package manager
- Environment variable `SERVER_SECRET_KEY` set with a valid secret key for authentication
- Access to the production Firebase project

## Usage

To run the script, navigate to the functions directory and use:

```bash
# Make sure you have the SERVER_SECRET_KEY environment variable set
export SERVER_SECRET_KEY=your_secret_key_here

# Run the script
pnpm run import:recipes

# Run in dry-run mode (no actual imports, just simulation)
pnpm run import:recipes -- --dry-run

# Set custom batch size (default is 5)
pnpm run import:recipes -- --batch-size 3
```

## Command-line Arguments

- `--dry-run`: Run in simulation mode without creating any recipes in Firestore
- `--batch-size <number>`: Number of recipes to process in each batch (default: 5)

## How It Works

1. The script loads recipes from the `recipes.ts` file
2. It processes recipes in batches to avoid overwhelming the server
3. For each recipe, it calls the `createRecipe` cloud function with proper authentication
4. It tracks success and error status for each recipe
5. At the end, it displays a summary report of the import operation

## Troubleshooting

If you encounter any issues:

1. Make sure the SERVER_SECRET_KEY environment variable is set correctly
2. Check that you have the necessary permissions to access the production environment
3. In case of network issues, try reducing the batch size
4. If a specific recipe fails to import, check the error message in the summary report

## Notes

- This script is idempotent - running it multiple times will create duplicate recipes
- Consider running with `--dry-run` first to verify what will be imported
- A 1-second delay is added between recipe imports to avoid rate limiting
