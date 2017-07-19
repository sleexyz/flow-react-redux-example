// @flow

import type { AppState } from "./store";

export type T = {
  saveToLocalStorage(AppState): void
};

export const make = (env: {}): T => ({
  saveToLocalStorage() {
    throw new Error("implement");
  }
});
