# Installation Instructions

## Using npm Workspaces

This project uses npm workspaces to manage dependencies across multiple packages. You can install all dependencies with a single command from the root directory:

```bash
npm install
```

This will install dependencies for:

- The root project
- The shared package
- The web (Next.js) application
- The API (Node.js) application

## Running the Development Servers

After installation, you can start all development servers with:

```bash
npm run dev
```

This will start both the web and API servers in development mode.

## Installing Additional Dependencies

To add a dependency to a specific workspace:

```bash
# For the web application
npm install package-name --workspace=web

# For the API application
npm install package-name --workspace=api

# For the shared package
npm install package-name --workspace=shared
```

## Fixing TypeScript Errors

If you're seeing TypeScript errors related to missing type definitions, you may need to install the appropriate @types packages:

```bash
# For React types
npm install @types/react @types/react-dom --workspace=web

# For Node.js types
npm install @types/node --workspace=api
```

## Troubleshooting

If you encounter issues with npm workspaces:

1. Make sure you're using npm version 7 or higher:

   ```bash
   npm --version
   ```

2. If you need to clean and reinstall:
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   ```
