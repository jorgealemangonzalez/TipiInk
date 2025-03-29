# Ingredient Sync to Trieve

This script synchronizes ingredients from Firestore to the Trieve search engine using the backend repositories and services.

## Features

- Uses backend repositories and services for consistent interaction with Firestore and Trieve
- Synchronizes all ingredients from Firestore to Trieve
- Updates existing ingredients if they already have a chunkId
- Creates a dedicated chunk group for ingredients (if it doesn't exist)
- Processes ingredients in configurable batch sizes
- Provides detailed logs and statistics about the sync process
- Supports a dry-run mode for testing without making changes

## Usage

Run the script from the root of the project using pnpm:

```bash
# Run with default settings (local environment)
pnpm scripts sync-ingredients-to-trieve

# Run in production environment
pnpm scripts sync-ingredients-to-trieve --prod

# Run in dry-run mode (no changes will be made to Firestore)
pnpm scripts sync-ingredients-to-trieve --dry-run

# Configure batch size (default is 25)
pnpm scripts sync-ingredients-to-trieve --batch-size 50

# Combine options
pnpm scripts sync-ingredients-to-trieve --prod --dry-run --batch-size 100
```

## What the Script Does

1. Initializes the backend services for Ingredients and Trieve
2. Gets or creates an ingredient chunk group in Trieve using the TrieveService
3. Fetches all ingredients from Firestore using the IngredientsRepository
4. Processes ingredients in batches:
    - For ingredients that already have a chunkId, it updates the chunk in Trieve using updateIngredientInTrieve service
    - For ingredients without a chunkId, it creates a new chunk in Trieve using createIngredientInTrieve service
5. The service methods automatically handle updating the Firestore documents with the new chunkIds
6. Provides a summary of the sync process

## Statistics

The script reports the following statistics:

- Total ingredients processed
- Successfully synced ingredients (new chunks created)
- Skipped ingredients (already had chunkId)
- Failed syncs (with detailed error messages)

## Dependencies

The script imports and uses the following backend code:

```javascript
const { getIngredientsRef, getIngredientRef } = require('@tipi/functions/lib/ingredients/IngredientsRepository')
const {
    getOrCreateChunkGroup,
    createIngredientInTrieve,
    updateIngredientInTrieve,
} = require('@tipi/functions/lib/trieve/TrieveService')
```
