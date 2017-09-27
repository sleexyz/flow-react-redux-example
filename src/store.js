// @flow
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import * as ReduxUtils from "@src/redux_utils";
import * as App from "@src/state/app";
import * as StorageService from "@src/services/storage_service";

export type WithDispatch<A: {}> = ReduxUtils.WithDispatch<A>;

// We re-export an application-specific ActionCreator class
export type Action<A, B> = ReduxUtils.Action<App.AppState, A, B>;

export function makeAction<A, B>(action: Action<A, B>): Action<A, B> {
  return ReduxUtils.makeAction(action);
}

const reducer = (state: App.AppState, action: *): App.AppState => {
  if (action.type === "setState") {
    return action.payload;
  }
  if (action.type === "modifyState") {
    return action.payload(state);
  }
  return state;
};

export function setState(payload: App.AppState) {
  return {
    type: "setState",
    payload
  };
}

export function modifyState(payload: App.AppState => App.AppState) {
  return {
    type: "modifyState",
    payload
  };
}

export const makeStore = () => {
  const initialState =
    StorageService.loadFromLocalStorage() || App.defaultState;
  return createStore(reducer, initialState, enhancer);
};

const saveToLocalStorageMiddleware = (() => {
  let _state = undefined;
  return store => next => action => {
    const nextState = store.getState();
    if (_state !== nextState) {
      StorageService.saveToLocalStorage(nextState);
      _state = nextState;
    }
    return next(action);
  };
})();

const enhancer = applyMiddleware(
  ReduxUtils.safeThunk,
  saveToLocalStorageMiddleware,
  createLogger()
);
