# Treppenhausreinigung creator app

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

Creates the staircase cleaning plan for your house.
Built with plain JavaScript, [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/).

This app is available at [treppenhausreinigung-creator.inpercima.net/](https://treppenhausreinigung-creator.inpercima.net/).

## Prerequisites

### Node, npm or pnpm

- `node 26.13.1` or higher in combination with
  - `npm 11.20.0` or higher or
  - `pnpm 12.21.0` or higher, used in this repository

Install pnpm by running:

```bash
npm install -g pnpm@12.21.0
```

### Info for npm and pnpm

This repo uses `pnpm` as package manager.
You can also use `npm` for your local work but changes will be made by `pnpm` only.

## Getting started

```bash
# clone project
git clone https://github.com/inpercima/treppenhausreinigung-creator/

# navigate to project
cd treppenhausreinigung-creator

# install dependencies
pnpm install
```

## Development Mode

### Running in development mode

```bash
pnpm start
```

The application will be available at [http://localhost:5173/](http://localhost:5173/) and automatically reload when you make changes to the source code.

## Production Mode

### Building for production

```bash
pnpm build
```

Creating an optimized bundle in `dist/`.

## Testing and linting

```bash
# e2e (requires dev server running)
npx cypress open

# lint files
pnpm lint
```
