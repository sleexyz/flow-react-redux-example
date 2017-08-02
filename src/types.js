// @flow
export type TodoState = "done" | "in-progress";

export type Todo = {
  content: string,
  state: TodoState
};

export type List = {
  todos: { [string]: Todo }
};

export type State = {|
  lists: {
    [listId: string]: List
  },
  navigationState: {
    listId: void | string
  }
|};
