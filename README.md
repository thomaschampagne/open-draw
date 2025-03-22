# Open Draw

**Open Draw** is a self-hosted integration of the latest [Excalidraw](https://excalidraw.com/) Web Component using React. It leverages:

- [Excalidraw NPM Package](https://www.npmjs.com/package/@excalidraw/excalidraw)
- [Excalidraw Integration Documentation](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration)

## ✅ Features

- **No Excalidraw+ Marketing Features:** Excludes marketing features pulled by the official [Excalidraw](https://excalidraw.com/) web app and [Docker Image](https://hub.docker.com/r/excalidraw/excalidraw).  
- **No Analytics:** No analytics tracking from the official web app and Docker image.  
- **Local Drawing Sessions:** Drawings are saved locally in IndexedDB for persistent, offline use.  
- **Custom Library Support:** Fully supports custom libraries.  
- **Regular Updates:** Frequently updated to the latest Excalidraw core and related library versions.  

## ❌ Limitations

- No support for **Sharing**.  
- No support for **Live Collaboration**.  

## 🚀 Dev Setup

1. Install dependencies:  

   ```bash
   pnpm i
   ```

2. Start the development server:  

   ```bash
   pnpm run dev
   ```

## 📌 To-Do List

- Enable Progressive Web App (PWA) support.  
- Add Docker support.  
- Implement CI/CD pipeline.  
- Prepare for official release.  
- Improve documentation.  
