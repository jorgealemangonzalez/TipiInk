# Using Backend Functions in Scripts

This README provides guidance on how to utilize backend services and repositories within the scripts folder of the TipiInk monorepo.

## Overview

The monorepo structure allows scripts to directly use backend code through the package references. This enables you to:

- Access services and repositories defined in the backend
- Perform CRUD operations on database entities
- Reuse types and utility functions from the shared package

## Prerequisites

Before running scripts that use backend functions:

1. Ensure you have built the backend code:

    ```bash
    cd backend/functions && pnpm run build
    cd backend/functions/shared && pnpm run build
    ```

2. Install dependencies for the scripts folder:
    ```bash
    cd scripts && pnpm install
    ```

## Available Scripts

- `pnpm run list-recipes`: Lists all recipes in the database
- `pnpm run recipe-ops`: Performs various operations with recipes (list, get, update, create)

## How to Create New Scripts

When creating new scripts that use backend functions:

1. Import the required functions from the backend:

    ```javascript
    const { someFunction } = require('@tipi/functions/lib/path/to/module')
    ```

2. Import shared types and utilities:

    ```javascript
    const { someType, someUtil } = require('@tipi/shared')
    ```

3. Add your script command to the `package.json` file.

## Example

Here's a simple example of a script using backend functions:

```javascript
const { getRecipesRef } = require('@tipi/functions/lib/recipes/RecipeRepository')

async function listRecipes() {
    try {
        const recipesRef = getRecipesRef()
        const recipesSnapshot = await recipesRef.get()

        recipesSnapshot.forEach(doc => {
            const recipe = doc.data()
            console.log(`- ${recipe.name} (ID: ${recipe.id})`)
        })
    } catch (error) {
        console.error('Error:', error)
    }
}

listRecipes()
```

## Troubleshooting

If you encounter issues:

1. **Module not found errors**: Ensure you've built the backend code and the path in your import is correct.
2. **Type errors**: Make sure you're using the correct types from the shared package.
3. **Firebase initialization errors**: The Firebase Admin should already be initialized in the backend code.

## Best Practices

1. Use `try/catch` blocks to handle errors gracefully
2. Consider using the same Firebase emulator for local development
3. Be careful with write operations in production environments
4. Add comments explaining the purpose of your script
