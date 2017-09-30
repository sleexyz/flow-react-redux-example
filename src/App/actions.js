// @flow
import pushid from "pushid";
import type { List } from "@src/types";
import { makeAction, type Action, setState, modifyState } from "@src/store";
import * as CurrentList from "./current_list";

export const addList: Action<List, string> = makeAction(newList => store => {
  const state = store.getState();
  const newListId = pushid();
  store.dispatch(
    setState({ ...state, lists: { ...state.lists, [newListId]: newList } })
  );
  return newListId;
});

export const focusList: Action<string, void> = makeAction(listId => store => {
  const state = store.getState();
  store.dispatch(
    setState({
      ...state,
      navigationState: { ...state.navigationState, listId }
    })
  );
});

export const addNewListAndFocus: Action<
  void,
  void
> = makeAction(() => store => {
  const newList = {
    todos: {}
  };
  const listId = store.dispatch(addList(newList));
  store.dispatch(focusList(listId));
});

export const deleteListAndFocusToNextList: Action<
  string,
  void
> = makeAction(listId => store => {
  const state = store.getState();
  const newLists = { ...state.lists };
  delete newLists[listId];
  const nextId = _determineNextListId(listId, state.lists);
  store.dispatch(
    setState({
      lists: newLists,
      navigationState: {
        ...state.navigationState,
        listId: nextId
      }
    })
  );
});

export const addTodo: Action<void, void> = makeAction(() => store => {
  store.dispatch(
    modifyState(CurrentList.modifyCurrentList(CurrentList.addNewTodo()))
  );
});

export const deleteTodo: Action<string, void> = makeAction(todoId => store => {
  store.dispatch(
    modifyState(CurrentList.modifyCurrentList(CurrentList.deleteTodo(todoId)))
  );
});

export const setTodoContent: Action<
  { todoId: string, content: string },
  void
> = makeAction(({ todoId, content }) => store => {
  store.dispatch(
    modifyState(
      CurrentList.modifyCurrentList(CurrentList.setTodoContent(todoId, content))
    )
  );
});

function _determineNextListId(
  listId,
  lists: { +[string]: List }
): void | string {
  if (!(listId in lists)) {
    return;
  }
  let lastId;
  for (const id in lists) {
    if (id == listId) {
      break;
    }
    lastId = id;
  }
  if (!lastId) {
    for (const id in lists) {
      if (id !== listId) {
        lastId = id;
        break;
      }
    }
  }
  return lastId;
}
