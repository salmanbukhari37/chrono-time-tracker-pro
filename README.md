# Chrono Time Tracker Pro

A comprehensive time tracking application built with Next.js, TypeScript, and Node.js in a monorepo structure.

## Project Structure

```
chrono-time-tracker-pro/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Node.js backend API
├── packages/
│   └── shared/       # Shared code, types, and utilities
├── package.json      # Root package.json for the monorepo
└── turbo.json        # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn (v1.22.19 or later)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

### Development

To run all applications in development mode:

```bash
yarn dev
```

To run a specific application:

```bash
# For the web application
yarn workspace web dev

# For the API
yarn workspace api dev
```

### Building

To build all applications:

```bash
yarn build
```

### Testing

To run tests across all applications:

```bash
yarn test
```

## License

MIT
