// @flow
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";

import * as ReduxUtils from "@src/redux_utils";
import * as App from "@src/state/app";
import * as StorageService from "@src/services/storage_service";

// We re-export an application-specific ActionCreator class
export class ActionCreator<A, B> extends ReduxUtils.ActionCreator<
  App.AppState,
  A,
  B
> {}

export type WithDispatch<A: {}> = ReduxUtils.WithDispatch<A>;

const saveToLocalStorageMiddleware = (() => {
  let state = undefined;
  return store => next => action => {
    const nextState = store.getState();
    if (state !== nextState) {
      StorageService.saveToLocalStorage(nextState);
      state = nextState;
    }
    return next(action);
  };
})();

export const makeStore = () => {
  const initialState =
    StorageService.loadFromLocalStorage() || App.defaultState;
  return createStore(
    ReduxUtils.makeReducer(initialState),
    applyMiddleware(
      // ReduxUtils
      ReduxUtils.hijackDispatch,
      // LocalStorage syncing
      saveToLocalStorageMiddleware,
      // Logger
      createLogger({
        level: {
          prevState: false,
          action: "log",
          nextState: false,
          error: "log"
        },
        predicate: (getState, action) => !action.parentAction,
        diff: true,
        diffPredicate: (getState, action) => action.type === "setState",
        collapsed: (getState, action) => action.type !== "setState"
      })
    )
  );
};
