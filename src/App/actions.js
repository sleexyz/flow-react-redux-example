// @flow
import pushid from "pushid";

import type { List } from "@src/types";
import { makeAction, type Action, setState } from "@src/store";

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

function _determineNextListId(
  listId,
  lists: { [string]: List }
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
