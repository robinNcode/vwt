# VWT Project Context for Claude

## Project overview
- Monorepo for Volt Wave Tech.
- Backend: Laravel 12 (PHP 8.2), JWT + Sanctum auth, Eloquent models, controllers, services, repositories.
- Frontend: React 18 + TypeScript + Vite + Tailwind.
- Shared workflow: backend exposes REST APIs; frontend consumes them through React pages/components.

## Key folders
- `.agents/`: repo instructions for AI coding agents.
- `backend/`: Laravel app, routes, models, services, controllers, tests.
- `frontend/src/`: React app pages, components, i18n, lib, assets.
- `deployment/`: Jenkins deployment and CI configuration.
- `scripts/`: operational helpers.
- `backup/`: legacy SQL/HTML assets and reference material.

## Working rules
- Keep changes scoped to the relevant layer: backend API or frontend UI, not both unless required.
- Prefer existing Laravel patterns: controllers, services, repositories, Eloquent models, routes, and tests.
- Prefer existing frontend patterns in `frontend/src/components`, `frontend/src/pages`, and `frontend/src/lib`.
- Keep API contracts stable; if a backend route changes, update the UI usage accordingly.
- Do not do broad refactors or rename core models/controllers without strong reason.
- Preserve existing localization patterns; the app uses Bengali default and English support.

## Important files
- `.agents/AGENTS.md`, `.agents/CLAUDE.md`, `.agents/GEMINI.md`
- `deployment/Jenkinsfile.backend` and `deployment/Jenkinsfile.frontend`
- `backend/routes/api.php` and `backend/routes/web.php`
- `backend/app/Http/Controllers/`
- `backend/app/Models/`
- `backend/app/Services/`
- `backend/app/Repositories/`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/pages/`
- `frontend/src/components/`

## Validation
Use the smallest relevant command:
- Backend: `cd backend && php artisan test` or `php artisan test --filter=...`
- Frontend: `cd frontend && npm run build`
- Lint: `cd frontend && npm run lint`

## Token-efficient behavior
- Read only the exact files needed for the task.
- Prefer surgical edits over large rewrites.
- If requirements are ambiguous, ask for the missing fact instead of guessing.
- Keep implementation and docs aligned with the existing architecture.
