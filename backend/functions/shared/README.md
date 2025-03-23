# @tipi/shared

This package contains shared types and utilities for TipiInk project.

## Why is it a part of the functions folder?

When deploying firebase functions cloud build requires all the local dependencies to be installed in the functions folder, as it rebuilds the node_modules wihout
context of the monorepo. See: https://www.codejam.info/2023/04/firebase-functions-monorepo.html#the-hybrid-approach , https://github.com/firebase/firebase-tools/issues/653#issuecomment-1464911379 , https://github.com/firebase/firebase-tools/issues/653#issuecomment-1464911379

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
