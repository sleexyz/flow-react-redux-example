// @flow
import * as App from "@src/state/app";

export function saveToLocalStorage(state: App.State): void {
  global.localStorage.setItem("App", JSON.stringify(state));
}

export function loadFromLocalStorage(): ?App.State {
  const item = global.localStorage.getItem("App");
  if (!item) {
    return;
  } else {
    return JSON.parse(item);
  }
}
