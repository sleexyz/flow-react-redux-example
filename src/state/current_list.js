// @flow
import pushid from "pushid";

import type { List } from "@src/types";
import { type Action, makeAction, modifyState } from "@src/store";
import type { AppState } from "@src/state/app";

const modifyCurrentList = (fn: List => List) => (state: AppState): AppState => {
  const currentListId = state.navigationState.listId;
  if (!currentListId) {
    throw new Error("no current list");
  }
  return {
    lists: { ...state.lists, [currentListId]: fn(state.lists[currentListId]) },
    navigationState: state.navigationState
  };
};

export const selectCurrentList = (state: AppState): ?List => {
  if (state.navigationState.listId == null) {
    return;
  }
  const currentListId = state.navigationState.listId;
  return state.lists[currentListId];
};

const _addTodo = () => (list: List): List => {
  const newTodo = {
    content: "",
    state: "in-progress"
  };
  return {
    todos: { ...list.todos, [pushid()]: newTodo }
  };
};

const _deleteTodo = (todoId: string) => (list: List): List => {
  const newTodos = { ...list.todos };
  delete newTodos[todoId];
  return {
    todos: newTodos
  };
};

const _setTodoContent = (todoId: string, content: string) => (
  list: List
): List => {
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
