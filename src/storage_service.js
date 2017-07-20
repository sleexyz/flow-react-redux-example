// @flow

import type { AppState } from "./store";

export type T = {
  saveToLocalStorage(AppState): void,
  loadFromLocalStorage(): ?AppState
};

export const make = (env: {}): T => ({
  saveToLocalStorage(state: AppState) {
    global.localStorage.setItem("App", state);
  },
  loadFromLocalStorage() {
    return JSON.parse(global.localStorage.getItem("App"));
  }
});
