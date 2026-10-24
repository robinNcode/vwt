# Gemini Project Instructions for VWT

## What this repo is
This project is a Laravel backend + React frontend monorepo for Volt Wave Tech.

## Primary stack
- PHP 8.2 / Laravel 12
- React 18 / TypeScript / Vite
- Tailwind CSS
- JWT and Sanctum-based auth

## Where to work
- Agent guidance: `.agents/`
- Backend code: `backend/`
- Frontend code: `frontend/src/`
- Deployment and CI: `deployment/` with Jenkins pipelines
- Operational scripts: `scripts/`, plus root `run.sh` and `run.bat`

## Focus rules
- Prefer direct, minimal edits.
- Keep backend and frontend contract aligned.
- Follow the existing app structure instead of creating a new abstraction layer.
- Do not do unrelated cleanup while fixing a bug or feature.

## Important directories
- `backend/routes/`
- `backend/app/Http/Controllers/`
- `backend/app/Models/`
- `backend/app/Services/`
- `backend/app/Repositories/`
- `frontend/src/pages/`
- `frontend/src/components/`
- `frontend/src/lib/`
- `frontend/src/i18n/`

## Common validation
- Backend tests: `cd backend && php artisan test`
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`

## Agent behavior
- Start from the specific file or route related to the change.
- Search narrowly before editing.
- Keep commits and patches small and reviewable.
- If a requirement is missing or the bug is ambiguous, ask before changing assumptions.
- Favor factual, existing patterns over invented conventions.

## Expected result
Agents should be able to understand the architecture in one pass and complete small, correctness-focused changes without reading the entire codebase.
