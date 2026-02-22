# formgen

An Nx monorepo workspace. This is a clean slate — apps and libraries will be added as the project grows.

## Workspace Setup

- **Nx** `22.5.1`
- **Package manager:** npm
- **Default stack:** Angular (frontend), Node.js (backend)
- **Testing:** Vitest (unit), Playwright (e2e)
- **Linting:** ESLint with `@nx/enforce-module-boundaries`
- **CI:** GitHub Actions + Nx Cloud (remote caching & distributed task execution)

## Common Commands

```bash
# Install dependencies
npm install

# Generate a new Angular app
pnpm nx g @nx/angular:app <name>

# Generate a new library
pnpm nx g @nx/angular:lib <name>

# Run a target for a project
pnpm nx run <project>:<target>

# Run a target across all projects
pnpm nx run-many -t build

# Run only affected projects
pnpm nx affected -t test

# Visualize the project graph
pnpm nx graph
```

## Project Structure

```
apps/        # Applications
libs/        # Shared libraries
design/      # Design documentation and references
```

## API Environment Variables

Copy `apps/api/.env` and populate the values before running the API.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | `postgresql://formgen:formgen@localhost:5432/formgen` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes* | — | API key for Gemini |
| `LLM_BASE_URL` | Yes* | — | OpenAI-compatible base URL for the LLM provider |
| `LLM_MODEL` | Yes* | — | Model identifier (e.g. `gemini-2.5-flash`) |

*If omitted, the generation service falls back to a stub response.

## Learn More

- [Nx Documentation](https://nx.dev)
- [Nx Cloud](https://nx.dev/ci/intro/why-nx-cloud)
- [Enforce Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
