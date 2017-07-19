// @flow
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import type { List } from "./types";
import * as ReduxUtils from "./redux_utils";
import * as Services from "./services";

export type AppState = {
  lists: {
    [listId: string]: List
  },
  navigationState: {
    listId: void | string,
  }
};

const initialState: AppState = {
  lists: {
    list1: {
      todos: []
    }
  },
  navigationState: {
    listId: "list1",
  }
};

export const selectCurrentList = (state: AppState) => {
  if (state.navigationState.listId == null) {
    return;
  }
  const currentListId = state.navigationState.listId;
  return state.lists[currentListId];
}

// We re-export an application-specific ActionCreator class
export class ActionCreator<A, B> extends ReduxUtils.ActionCreator<
  AppState,
  Services.Env,
  A,
  B
> {}

export const makeStore = () =>
  createStore(
    ReduxUtils.makeReducer(initialState),
    applyMiddleware(
      // ReduxUtils
      ReduxUtils.hijackDispatch({
        env: Services.makeEnv()
      }),
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
