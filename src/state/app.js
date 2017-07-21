// @flow
import type { List } from "types";

export type AppState = {|
  lists: {
    [listId: string]: List
  },
  navigationState: {|
    listId: void | string
  |}
|};

export const defaultState: AppState = {
  lists: {
    list1: {
      todos: {}
    }
  },
  navigationState: {
    listId: "list1"
  }
};
