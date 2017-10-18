// @flow
import { applyMiddleware, createStore } from "redux";

import * as Types from "@src/types";
import * as StorageService from "@src/services/storage_service";
import Callable from "callable-class";

type Ops = {
  dispatch: <B>((Ops => B) | { type: string }) => B,
  getState: () => Types.State
};

export class ActionCreator<A, B> extends Callable<A, (Ops) => B> {
  toFinish: ?Promise<B>;
  constructor(f: A => Ops => B) {
    super(x => ops => {
      const y = f(x)(ops);
      if (y && typeof (y: any).then === "function") {
        (this: any).toFinish = y;
      }
      return y;
    });
  }
}

export type WithDispatch<A: {}> = {
  ...$Exact<A>,
  dispatch: <B>((Ops => B) | { type: string }) => B
};

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

export const setState = (state: Types.State) => ({
  type: "setState",
  payload: state
});

export const modifyState = (f: Types.State => Types.State) => ({
  type: "modifyState",
  payload: f
});

export const reducer = (state, action) => {
  if (action.type === "setState") {
    return action.payload;
  } else if (action.type === "modifyState") {
    return action.payload(state);
  }
  return state;
};

const safeThunk = store => next => action => {
  if (typeof action === "function") {
    return action(store);
  }
  return next(action);
};

const defaultState: Types.State = {
  lists: {
    list1: {
      todos: {}
    }
  },
  navigationState: {
    listId: "list1"
  }
};

export const makeStore = () => {
  const initialState = StorageService.loadFromLocalStorage() || defaultState;
  return createStore(
    reducer,
    initialState,
    applyMiddleware(saveToLocalStorageMiddleware, safeThunk)
  );
};
