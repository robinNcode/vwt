# Volt Wave Tech Frontend (React + Vite)

This is the converted frontend for Volt Wave Tech, migrated from Next.js to React with TypeScript and Vite.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Localization**: i18next (Default: Bengali)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router DOM

## Getting Started

1. Navigate to the project directory:
   ```bash
   cd frontend/vwt-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Design Principles
- **White Theme**: Pure white background with subtle slate text for a clean, premium look.
- **Glassmorphism**: Semi-transparent navigation with backdrop blur.
- **Micro-interactions**: Smooth hover effects and page transitions using Framer Motion.
- **Responsive**: Mobile-first design that adapts to all screen sizes.

## Localization
The application defaults to Bengali (`bn`). You can switch to English using the globe icon in the navigation bar.
Translations are located in `src/i18n.ts`.
