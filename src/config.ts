import localforage from 'localforage';
import { OpenDrawConfig } from '.';

export const config: OpenDrawConfig = {
  driver: localforage.INDEXEDDB,
  dbName: 'open-draw',
  saveDebounceMs: 750
};
