// @flow
import * as Types from "@src/types";

export function saveToLocalStorage(state: Types.State): void {
  global.localStorage.setItem("App", JSON.stringify(state));
}

export function loadFromLocalStorage(): ?Types.State {
  const item = global.localStorage.getItem("App");
  if (!item) {
    return;
  } else {
    return JSON.parse(item);
  }
}
