// @flow

export type TodoState = "done" | "in-progress";

export type Todo = {
  content: string,
  state: TodoState
};

export type List = {
  todos: Array<Todo>
};
