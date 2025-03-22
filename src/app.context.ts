import { createContext } from 'react';
import { ImportedDataState, ImportedLibraryData } from '@excalidraw/excalidraw/data/types';
import { ExcalidrawImperativeAPI, LibraryItems, LibraryItemsSource } from '@excalidraw/excalidraw/types';
import { DrawState, IConfig } from './types';
import { IStateStorage } from './state.storage';
import { debounce } from './utils';

export interface IAppContext {
  getInitialSavedState(): Promise<ImportedDataState | null>;
  saveDrawState(drawDataState: DrawState): Promise<void>;
  saveLibraryItems(libraryItems: LibraryItems): Promise<void>;
  tryImportLibraryFromUrl(excalidrawAPI: ExcalidrawImperativeAPI): Promise<void>;
}

export class AppContextImpl implements IAppContext {
  private readonly config: IConfig;
  private readonly stateStorage: IStateStorage;
  public readonly debounceSaveDrawState: (drawState: DrawState) => void;

  constructor(config: IConfig, stateStorage: IStateStorage) {
    this.config = config;
    this.stateStorage = stateStorage;

    // Init storage configuration
    this.stateStorage.configureStorage(this.config.dbName);

    this.debounceSaveDrawState = debounce(async (drawState: DrawState) => {
      await this.stateStorage.setAppState(drawState.appState);
      await this.stateStorage.setExcalidrawElement(drawState.elements);
      await this.stateStorage.setBinaryFiles(drawState.files);
      console.info('Draw State saved');
    }, this.config.saveDebounceMs)
  }

  public async getInitialSavedState(): Promise<ImportedDataState | null> {
    const existingAppState = await this.stateStorage.getAppState();
    const existingElements = await this.stateStorage.getExcalidrawElement();
    const existingFiles = (await this.stateStorage.getBinaryFiles()) || undefined;
    const existingLibraryItems = (await this.stateStorage.getLibraryItems()) || undefined;

    return {
      appState: existingAppState,
      elements: existingElements,
      files: existingFiles,
      libraryItems: existingLibraryItems
    };
  }

  public async tryImportLibraryFromUrl(excalidrawAPI: ExcalidrawImperativeAPI): Promise<void> {
    // Check if the hash starts with #addLibrary
    if (window.location.hash.startsWith('#addLibrary=')) {
      try {
        // Remove the '#' character and create a URLSearchParams object
        const params = new URLSearchParams(window.location.hash.slice(1));

        // Get the library URL parameter
        const libraryUrl = params.get('addLibrary');

        if (!libraryUrl) {
          return;
        }

        // Decode the URL to get the actual library URL
        const decodedLibraryUrl = decodeURIComponent(libraryUrl);

        const response = await fetch(decodedLibraryUrl);
        const exportedLibrary = (await response.json()) as ImportedLibraryData;

        const libraryItems = (exportedLibrary.libraryItems || exportedLibrary.library) as LibraryItemsSource;
        await excalidrawAPI?.updateLibrary({
          libraryItems: libraryItems,
          merge: true,
          openLibraryMenu: true
        });
      } catch (error) {
        console.error('Error fetching library data:', error);
        alert('Error fetching library data. Please try again.');
        return;
      }

      // Remove the hash from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  public async saveDrawState(drawState: DrawState): Promise<void> {
    this.debounceSaveDrawState(drawState);
  }

  public async saveLibraryItems(libraryItems: LibraryItems): Promise<void> {
    await this.stateStorage.setLibraryItems(libraryItems);
  }
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
