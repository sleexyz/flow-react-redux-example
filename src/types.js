// @flow
export type TodoState = "done" | "in-progress";

export type Todo = {
  content: string,
  state: TodoState
};

export type List = {
  todos: { [string]: Todo }
};

export type AppState = {|
  lists: {
    [listId: string]: List
  },
  navigationState: {|
    listId: void | string
  |}
|};

export const defaultAppState: AppState = {
  lists: {
    list1: {
      todos: {}
    }
  },
  navigationState: {
    listId: "list1"
  }
};
