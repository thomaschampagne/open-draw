import './App.css';
import '@excalidraw/excalidraw/index.css';
import { useCallback, useEffect, useState } from 'react';
import { ImportedDataState } from '@excalidraw/excalidraw/data/types';
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { Excalidraw, WelcomeScreen, MainMenu } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI, AppState, BinaryFiles, LibraryItems } from '@excalidraw/excalidraw/types';
import localforage from 'localforage';
import { version as appVersion } from '../package.json';
import { version as excalidrawVersion } from '../node_modules/@excalidraw/excalidraw/package.json';
import {
  configureStorage,
  debouncePersistDrawDataState as persistDrawDataState,
  DrawDataState,
  getInitialSavedState,
  tryImportLibraryFromUrl
} from '.';
import { config } from './config';

// Init storage config
await configureStorage(config);
const initialSavedState = await getInitialSavedState();

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [dataState] = useState<ImportedDataState | null>(initialSavedState);

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }

    console.info(`Mode: ${import.meta.env.MODE}`);
    console.info(`App Version: ${appVersion}`);
    console.info(`Excalidraw Web Component Version: ${excalidrawVersion}`);

    // Detect if the user is trying to import a library from a URL
    (async () => {
      await tryImportLibraryFromUrl(excalidrawAPI);
    })();

    const handleLibraryImportDetection = async () => {
      await tryImportLibraryFromUrl(excalidrawAPI);
    };

    window.addEventListener('popstate', handleLibraryImportDetection);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handleLibraryImportDetection);
    };
  }, [excalidrawAPI]);

  const onDrawingChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      const drawDataState: DrawDataState = {
        elements: elements,
        appState: appState,
        files: files
      };
      persistDrawDataState(drawDataState);
    },
    []
  );

  const onLibraryChange = useCallback(async (libraryItems: LibraryItems) => {
    await localforage.setItem('libraryItems', libraryItems);
    console.info('Library Items saved');
  }, []);

  return (
    <>
      <div className="wrapper">
        <Excalidraw
          excalidrawAPI={api => setExcalidrawAPI(api)}
          initialData={dataState}
          onChange={onDrawingChange}
          onLibraryChange={onLibraryChange}
        >
          <WelcomeScreen />
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveToActiveFile />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.SearchMenu />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.Help />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
        </Excalidraw>
      </div>
    </>
  );
}

export default App;
