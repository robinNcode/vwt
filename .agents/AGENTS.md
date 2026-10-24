# VWT Agent Guide

## Repository summary
This repository contains a Laravel backend and a React frontend in one monorepo.

- Agent guidance: `.agents/` with repo instructions for Claude, Codex, and Gemini.
- Backend: `backend/` with Laravel 12, PHP 8.2, JWT/Sanctum, MySQL-ready app configuration.
- Frontend: `frontend/` with Vite, React 18, TypeScript, Tailwind, and router-based SPA.
- Deployment and CI: `deployment/` with Jenkins pipelines.
- Operational scripts: `scripts/`, plus root `run.sh` and `run.bat`.

## Architecture expectations
- Backend work belongs in `backend/app`, `backend/routes`, and `backend/database`.
- Frontend work belongs in `frontend/src`.
- Business logic should live in services/repositories where appropriate; keep controllers thin.
- API routes should be consistent with frontend calls and response shapes.
- Do not introduce a new architecture pattern when the repo already has a clear Laravel/React structure.

## Typical commands
- Backend install: `cd backend && composer install`
- Backend dev/test: `cd backend && php artisan test`
- Backend lint/format: `cd backend && ./vendor/bin/pint`
- Frontend install: `cd frontend && npm install`
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`

## Change strategy
- Start from the relevant route/controller/model or page/component; do not read the entire repo.
- Keep scope narrow and behavior-preserving.
- For new backend features, also check whether the frontend needs a matching call or state update.
- For new UI work, match the existing style and component organization.
- Preserve i18n support, project naming, and existing auth expectations.

## Guardrails
- Avoid broad refactors, dead code, or speculative cleanup.
- Avoid changing DB schema without a clear requirement or migration plan.
- Prefer small, reviewable patches with targeted tests.
- If a requested change is unclear, ask for one missing fact rather than guessing.

## Quick map
- `.agents/` — repo-specific instructions for AI agents
- `deployment/` — Jenkins deployment pipelines
- `backend/routes/api.php` — API endpoints
- `backend/app/Http/Controllers/` — HTTP handlers
- `backend/app/Models/` — Eloquent models
- `backend/app/Services/` — domain/service logic
- `backend/app/Repositories/` — repository layer
- `frontend/src/pages/` — route pages
- `frontend/src/components/` — reusable UI
- `frontend/src/lib/` — helpers and utilities
- `frontend/src/i18n/` — translations and locale setup
- `scripts/` — operational helpers and deployment scripts
