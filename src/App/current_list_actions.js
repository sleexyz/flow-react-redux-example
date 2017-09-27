// @flow
import pushid from "pushid";

import { type Action, makeAction, modifyState } from "@src/store";
import * as Types from "@src/types";

const modifyCurrentList = (fn: Types.List => Types.List) => (
  state: Types.AppState
): Types.AppState => {
  const currentListId = state.navigationState.listId;
  if (!currentListId) {
    throw new Error("no current list");
  }
  return {
    lists: { ...state.lists, [currentListId]: fn(state.lists[currentListId]) },
    navigationState: state.navigationState
  };
};

export const _selectCurrentList = (state: Types.AppState): ?Types.List => {
  if (state.navigationState.listId == null) {
    return;
  }
  const currentListId = state.navigationState.listId;
  return state.lists[currentListId];
};

const _addTodo = () => (list: Types.List): Types.List => {
  const newTodo = {
    content: "",
    state: "in-progress"
  };
  return {
    todos: { ...list.todos, [pushid()]: newTodo }
  };
};

const _deleteTodo = (todoId: string) => (list: Types.List): Types.List => {
  const newTodos = { ...list.todos };
  delete newTodos[todoId];
  return {
    todos: newTodos
  };
};

const _setTodoContent = (todoId: string, content: string) => (
  list: Types.List
): Types.List => {
  const todo = list.todos[todoId];
  if (!todo) {
    throw new Error("todoId not found");
  }
  const newTodo = {
    content,
    state: todo.state
  };
  return {
    todos: { ...list.todos, [todoId]: newTodo }
  };
};

export const addTodo: Action<void, void> = makeAction(() => store => {
  store.dispatch(modifyState(modifyCurrentList(_addTodo())));
});

export const deleteTodo: Action<string, void> = makeAction(todoId => store => {
  store.dispatch(modifyState(modifyCurrentList(_deleteTodo(todoId))));
});

export const setTodoContent: Action<
  { todoId: string, content: string },
  void
> = makeAction(({ todoId, content }) => store => {
  store.dispatch(
    modifyState(modifyCurrentList(_setTodoContent(todoId, content)))
  );
});
