// @flow
import type { AppState } from "@src/state/app";

export type T = {
  saveToLocalStorage(AppState): void,
  loadFromLocalStorage(): ?AppState
};

export const make = (env: {}): T => ({
  saveToLocalStorage(state: AppState) {
    global.localStorage.setItem("App", JSON.stringify(state));
  },
  loadFromLocalStorage() {
    const item = global.localStorage.getItem("App");
    if (!item) {
      return;
    } else {
      return JSON.parse(item);
    }
  }
});
