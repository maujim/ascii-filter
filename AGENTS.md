# AGENTS instructions

## Project Overview

This repository contains a simple React/Vite app for uploading a PNG/JPG image or MP4 video and rendering the selected media full screen.

## Repository Layout

- `src/`: React application source.
- `src/main.jsx`: App entry point and upload/media rendering logic.
- `src/styles.css`: Full-screen layout and upload controls.
- `index.html`: Vite HTML entry point.
- `extras/`: Ignore this folder unless a task explicitly asks for it.

## Package Manager

Use **pnpm** for all dependency and script commands.

- Do not use `npm install`, `npm run`, `yarn`, or generated `package-lock.json` / `yarn.lock` files.
- If dependencies change, update `pnpm-lock.yaml`.
- If a different package manager created artifacts, remove them before committing.

## Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm run dev`
- Build production assets: `pnpm run build`
- Preview production build: `pnpm run preview`

## Implementation Guidance

- Keep the app intentionally small and dependency-light.
- Accept only PNG/JPG images and MP4 videos in the upload control and in runtime validation.
- Render selected media full screen against a black background.
- Preserve the ability to replace the selected file without refreshing.
- Revoke object URLs when replacing media or unmounting to avoid memory leaks.
- Do not add features from `extras/` unless specifically requested.

## Review Checklist

Before committing changes:

1. Run `pnpm run build`.
2. Confirm no `package-lock.json` or `yarn.lock` is present.
3. Confirm `extras/` remains ignored and unmodified unless explicitly requested.
4. Add or update documentation when behavior or commands change.
