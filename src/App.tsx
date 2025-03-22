import './App.css';
import '@excalidraw/excalidraw/index.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ImportedDataState } from '@excalidraw/excalidraw/data/types';
import { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { Excalidraw, WelcomeScreen, MainMenu } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI, AppState, BinaryFiles, LibraryItems } from '@excalidraw/excalidraw/types';
import { version as appVersion } from '../package.json';
import { version as excalidrawVersion } from '../node_modules/@excalidraw/excalidraw/package.json';
import { AppContext } from './app.context';
import { DrawState } from './types';

function App() {
  const appContext = useContext(AppContext);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initialDataState, setInitialDataState] = useState<ImportedDataState | null>(null);

  useEffect(() => {
    // Skip if already initialized
    if (initialDataState) {
      return;
    }

    console.info(`Mode: ${import.meta.env.MODE}`);
    console.info(`App Version: ${appVersion}`);
    console.info(`Excalidraw Web Component Version: ${excalidrawVersion}`);

    (async () => {
      const initialSavedState = await appContext.getInitialSavedState();
      setInitialDataState(initialSavedState || {});
    })();
  }, [appContext, initialDataState]);

  useEffect(() => {
    // Skip if not initialized
    if (!initialDataState || !excalidrawAPI) {
      return;
    }

    const handleLibraryImportDetection = async () => {
      await appContext.tryImportLibraryFromUrl(excalidrawAPI);
    };

    window.addEventListener('popstate', handleLibraryImportDetection);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handleLibraryImportDetection);
    };
  }, [appContext, excalidrawAPI, initialDataState]);

  const onDrawingChange = useCallback(
    async (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      const drawState: DrawState = {
        elements: elements,
        appState: appState,
        files: files
      };
      await appContext.saveDrawState(drawState);
    },
    [appContext]
  );

  const onLibraryChange = useCallback(
    async (libraryItems: LibraryItems) => {
      await appContext.saveLibraryItems(libraryItems);
      console.info('Library Items saved');
    },
    [appContext]
  );

  return (
    <>
      {initialDataState && (
        <div className="wrapper">
          <Excalidraw
            excalidrawAPI={api => setExcalidrawAPI(api)}
            initialData={initialDataState}
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
      )}
    </>
  );
}

export default App;
