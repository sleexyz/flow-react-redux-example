// @flow
import * as Types from "@src/types";

export function saveToLocalStorage(state: Types.AppState): void {
  global.localStorage.setItem("App", JSON.stringify(state));
}

export function loadFromLocalStorage(): ?Types.AppState {
  const item = global.localStorage.getItem("App");
  if (!item) {
    return;
  } else {
    return JSON.parse(item);
  }
}
