import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { AppState, BinaryFiles, Collaborator, LibraryItems, SocketId } from '@excalidraw/excalidraw/types';
import localforage from 'localforage';

export interface IStateStorage {
  configureStorage(dbName: string): Promise<void>;
  getAppState(): Promise<AppState | null>;
  getExcalidrawElement(): Promise<ExcalidrawElement[] | null>;
  getBinaryFiles(): Promise<BinaryFiles | null>;
  getLibraryItems(): Promise<LibraryItems | null>;
  setAppState(appState: AppState): Promise<void>;
  setExcalidrawElement(elements: readonly ExcalidrawElement[]): Promise<void>;
  setBinaryFiles(binaryFiles: BinaryFiles): Promise<void>;
  setLibraryItems(libraryItems: LibraryItems): Promise<void>;
}

export class StateStorage implements IStateStorage {
  public async configureStorage(dbName: string): Promise<void> {
    localforage.config({
      name: dbName,
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
    });
  }

  public async getAppState(): Promise<AppState | null> {
    const existingAppStateStr = await localforage.getItem<string | null>('appState');
    if (!existingAppStateStr) {
      return null;
    }

    return {
      ...(JSON.parse(existingAppStateStr) as AppState),
      collaborators: new Map<SocketId, Collaborator>()
    };
  }

  public async getExcalidrawElement(): Promise<ExcalidrawElement[] | null> {
    return await localforage.getItem<ExcalidrawElement[] | null>('elements');
  }

  public async getBinaryFiles(): Promise<BinaryFiles | null> {
    return await localforage.getItem<BinaryFiles>('files');
  }

  public async getLibraryItems(): Promise<LibraryItems | null> {
    return await localforage.getItem<LibraryItems>('libraryItems');
  }

  public async setAppState(appState: AppState): Promise<void> {
    await localforage.setItem('appState', JSON.stringify(appState));
  }

  public async setExcalidrawElement(elements: ExcalidrawElement[]): Promise<void> {
    await localforage.setItem('elements', elements);
  }

  public async setBinaryFiles(binaryFiles: BinaryFiles): Promise<void> {
    await localforage.setItem('files', binaryFiles);
  }

  public async setLibraryItems(libraryItems: LibraryItems): Promise<void> {
    await localforage.setItem('libraryItems', libraryItems);
  }
}
