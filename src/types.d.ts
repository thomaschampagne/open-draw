export type DrawState = {
  appState: AppState;
  elements: readonly ExcalidrawElement[];
  files?: BinaryFiles;
};

export type IConfig = {
  dbName: string;
  saveDebounceMs: number;
};
