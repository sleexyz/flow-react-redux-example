// @flow
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import * as ReduxUtils from "@src/redux_utils";
import * as Types from "@src/types";
import * as Storage from "@src/storage";

export type WithDispatch<A: {}> = ReduxUtils.WithDispatch<A>;

export type Action<A, B> = ReduxUtils.Action<Types.AppState, A, B>;

export function makeAction<A, B>(action: Action<A, B>): Action<A, B> {
  return ReduxUtils.makeAction(action);
}

const reducer = (state: Types.AppState, action: any): Types.AppState => {
  if (action.type === "setState") {
    return action.payload;
  }
  if (action.type === "modifyState") {
    return action.payload(state);
  }
  return state;
};

export function setState(payload: Types.AppState) {
  return {
    type: "setState",
    payload
  };
}

export function modifyState(payload: Types.AppState => Types.AppState) {
  return {
    type: "modifyState",
    payload
  };
}

export const makeStore = () => {
  const initialState = Storage.loadFromLocalStorage() || Types.defaultAppState;
  return createStore(reducer, initialState, enhancer);
};

const saveToLocalStorageMiddleware = (() => {
  let _state = undefined;
  return store => next => action => {
    const nextState = store.getState();
    if (_state !== nextState) {
      Storage.saveToLocalStorage(nextState);
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
