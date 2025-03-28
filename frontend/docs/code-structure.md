# Code Structure

We use [feature sliced](https://feature-sliced.design/) but with some modifications.

<img src="./images/feature-sliced.png" alt="Feature Sliced Scheme" width="400px" />

The layers are standardized and vertically arranged.
Modules on one layer can only interact with modules from the layers strictly below (except for `shared`, which everyone can interact with).
We currently have six of them (bottom to top):

1. `shared` — reusable functionality, detached from the specifics of the project/business.(e.g. UIKit, libs, API)
2. `entities` — business entities.(e.g., User, Product, Order)
3. `features` — user interactions, actions that bring business value to the user.(e.g. SendComment, AddToCart, UsersSearch)
4. `widgets` — compositional layer to combine entities and features into meaningful blocks.(e.g. IssuesList, UserProfile)
5. `pages` — compositional layer to construct full pages from entities, features and widgets.
6. `app` - page initialization and app-wide settings (e.g. `app/styles.ts`, `app/layout.tsx`).

Then there are **slices**, which partition the code by business domain.
This makes your codebase easy to navigate by keeping logically related modules close together.
Slices cannot use other slices on the same layer, and that helps with high cohesion
and low coupling.

Each slice, in turn, consists of **segments**.
These are tiny modules that are meant to help with separating code within a slice
by its technical purpose. The most common segments are ui, model (store, actions),
api and lib (utils/hooks), but you can omit some or add more, as you see fit.

## Modifications

In order to not overengineer we will add the following rules to the original architecture:

-   We'll only use `widgets` in case the composition of `features`/`entities` needs to be reused in multiple `pages`, otherwise we'll use that composition directly in the `page` that needs it.
-   Only when a `feature` is reused in multiple higher layers will we put it at the root `features` folder, in case it's only used in one higher layer it will go inside a `features` folder inside that layer.
-   Only when an `entity` is reused in multiple higher layers will we put it at the root `entities` folder, in case it's only used in one higher layer it will go inside an `entities` folder inside that layer.
