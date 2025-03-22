import { ImportedDataState, ImportedLibraryData } from '@excalidraw/excalidraw/data/types';
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import {
  AppState,
  BinaryFiles,
  SocketId,
  Collaborator,
  LibraryItems,
  ExcalidrawImperativeAPI,
  LibraryItemsSource
} from '@excalidraw/excalidraw/types';
import localforage from 'localforage';
import { config } from './config';

export type DrawDataState = {
  appState: AppState;
  elements: readonly ExcalidrawElement[];
  files?: BinaryFiles;
};

export type OpenDrawConfig = {
  driver: string;
  dbName: string;
  saveDebounceMs: number;
};

export const getInitialSavedState: () => Promise<ImportedDataState | null> = async () => {
  const existingAppStateStr = await localforage.getItem<string | null>('appState');
  if (!existingAppStateStr) {
    return null;
  }

  const existingAppState = {
    ...(JSON.parse(existingAppStateStr) as AppState),
    collaborators: new Map<SocketId, Collaborator>()
  };
  const existingElements = await localforage.getItem<ExcalidrawElement[] | null>('elements');
  const existingFiles = (await localforage.getItem<BinaryFiles>('files')) || undefined;
  const existingLibraryItems = (await localforage.getItem<LibraryItems>('libraryItems')) || undefined;

  return {
    appState: existingAppState,
    elements: existingElements,
    files: existingFiles,
    libraryItems: existingLibraryItems
  };
};

export const tryImportLibraryFromUrl: (excalidrawAPI: ExcalidrawImperativeAPI | null) => Promise<void> = async (
  excalidrawAPI: ExcalidrawImperativeAPI | null
) => {
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
      excalidrawAPI?.updateLibrary({
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
};

export const configureStorage: (config: OpenDrawConfig) => Promise<void> = async (config: OpenDrawConfig) => {
  localforage.config({
    name: config.dbName
  });

  // Restore existing state
  await localforage.setDriver(config.driver);
};

export const debouncePersistDrawDataState = debounce(async (drawDataState: DrawDataState) => {
  await localforage.setItem('elements', drawDataState.elements);
  await localforage.setItem('appState', JSON.stringify(drawDataState.appState));
  await localforage.setItem('files', drawDataState.files);
  console.info('Draw State saved');
}, config.saveDebounceMs);

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: unknown, ...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}
