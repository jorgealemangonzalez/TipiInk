# @tipi/shared

This package contains shared types and utilities for TipiInk project.

## Installation

As this is a part of the monorepo, you can use the package directly after running:

```bash
pnpm install
```

## Usage

You can import the recipe types like this:

```typescript
// Import specific type
import { Recipe } from '@tipi/shared/recipe/recipeEntity'

// Or import all types from recipe entity
import * as RecipeEntity from '@tipi/shared/recipe/recipeEntity'
```

## Building

To build the package:

```bash
pnpm --filter @tipi/shared build
```

To watch for changes during development:

```bash
pnpm --filter @tipi/shared dev
``` 