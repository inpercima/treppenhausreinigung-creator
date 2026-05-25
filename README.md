# Treppenhausreinigung creator app

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

The app to create the staircase cleaning plan.

Built with plain JavaScript, [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/).

## Prerequisites

### Node, npm or pnpm

* `node 24.16.0` or higher in combination with
  * `npm 11.13.0` or higher or
  * `pnpm 11.3.0` or higher, used in this repository

## Getting started

```bash
# clone project
git clone https://github.com/inpercima/treppenhausreinigung-creator/
cd treppenhausreinigung-creator

# install dependencies
pnpm install
```

## Usage

### Run in development mode

```bash
# starts a dev server with hot reload, reachable on http://localhost:5173/
pnpm start
```

### Build

```bash
# build for production, output in dist/
pnpm build

# preview the production build locally
pnpm preview
```

### Lint

```bash
pnpm lint
```

### Tests

```bash
# e2e (requires dev server running)
npx cypress open
```
