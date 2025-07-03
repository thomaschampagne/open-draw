# Open Draw

Essential self-hosted integration of the up-to-date Excalidraw web component.

## 🚀 Run

To run Open Draw using Docker:

```sh
docker run -dit --rm --name open-draw -p 3000:3000 ghcr.io/thomaschampagne/open-draw:latest
```

## ✨ Features

- **No Excalidraw+ Marketing Features:** Excludes marketing elements from the official [Excalidraw](https://excalidraw.com/) web app and [Docker Image](https://hub.docker.com/r/excalidraw/excalidraw).
- **No Analytics:** Removes all analytics tracking present in the official versions.
- **Local Drawing Sessions:** Drawings are stored locally in IndexedDB for persistent, offline use.
- **Custom Library Support:** Fully supports custom libraries.
- **Regular Updates:** Maintained with the latest Excalidraw core and related library versions.

**Limitations:** No support for **Sharing** and **Live Collaboration**.

## ⚡ Maintenance: Upgrade Dependencies

Upgrade dependencies using one of the following methods:

- Via container:

```sh
sh ./scripts/integrate.docker.sh
```

- Via Node.js:

```sh
pnpm run integrate && \
  pnpm run preview
```

- Sanity Checks:
  - Verify that drawings persist after reloading the page.
  - Confirm successful library import without errors.
  - Ensure drawings can be saved and retrieved correctly.
  - Verify no errors raised in console logs.

## 📦 Build

### Using Docker

```sh
docker build -t open-draw:latest . && \
  docker run -dit --rm --name open-draw -p 3000:3000 open-draw:latest
```

### Using Node.js with pnpm

```sh
pnpm install
pnpm run build
```

## 👨‍💻 Development

### Using DevContainer

Use the  `.devcontainer/devcontainer.json` spec into your IDE.

### Running Locally

```sh
pnpm install
pnpm run dev
```

## 🔗 Sources

- [Excalidraw NPM Package](https://www.npmjs.com/package/@excalidraw/excalidraw)
- [Excalidraw Integration Documentation](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration)

## 📌 To-Do List

- [ ] Set up Dependabot or Renovate.
- [ ] Enable Progressive Web App (PWA) support.
