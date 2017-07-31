// @flow
import type { AppState } from "@src/state/app";

export function saveToLocalStorage(state: AppState): void {
  global.localStorage.setItem("App", JSON.stringify(state));
}

export function loadFromLocalStorage(): ?AppState {
  const item = global.localStorage.getItem("App");
  if (!item) {
    return;
  } else {
    return JSON.parse(item);
  }
}
