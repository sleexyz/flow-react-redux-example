// @flow
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import type { Dispatch } from "redux";

import * as ReduxUtils from "redux_utils";
import * as Services from "services";
import * as App from "state/app";

// We re-export an application-specific ActionCreator class
export class ActionCreator<A, B> extends ReduxUtils.ActionCreator<
  App.AppState,
  Services.Env,
  A,
  B
> {}

type Action = ReduxUtils.Action<App.AppState, Services.Env, any, any>;

export type WithDispatch<A: {}> = A & { dispatch: Dispatch<Action> };

const makeSaveToLocalStorageMiddleware = (env: Services.Env) => {
  let state = undefined;
  return store => next => action => {
    const nextState = store.getState();
    if (state !== nextState) {
      env.storageService.saveToLocalStorage(nextState);
      state = nextState;
    }
    return next(action);
  };
};

export const makeStore = (env: Services.Env) => {
  const initialState =
    env.storageService.loadFromLocalStorage() || App.defaultState;
  return createStore(
    ReduxUtils.makeReducer(initialState),
    applyMiddleware(
      // ReduxUtils
      ReduxUtils.hijackDispatch({ env }),
      // LocalStorage syncing
      makeSaveToLocalStorageMiddleware(env),
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
