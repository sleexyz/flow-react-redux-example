// @flow
import pushid from "pushid";
import type { List } from "@src/types";
import { ActionCreator, setState } from "@src/store";

export const addList: ActionCreator<
  List,
  string
> = new ActionCreator(newList => ops => {
  const state = ops.getState();
  const newListId = pushid();
  ops.dispatch(
    setState({ ...state, lists: { ...state.lists, [newListId]: newList } })
  );
  return newListId;
});

export const focusList: ActionCreator<
  string,
  void
> = new ActionCreator(listId => ops => {
  const state = ops.getState();
  ops.dispatch(
    setState({
      ...state,
      navigationState: { ...state.navigationState, listId }
    })
  );
});

export const addNewListAndFocus: ActionCreator<
  void,
  void
> = new ActionCreator(() => ops => {
  const newList = {
    todos: {}
  };
  const listId = ops.dispatch(addList(newList));
  ops.dispatch(focusList(listId));
});

const getNextId = (listId, lists: { [string]: List }): void | string => {
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
};

export const deleteListAndFocusToNextList: ActionCreator<
  string,
  void
> = new ActionCreator(listId => ops => {
  const state = ops.getState();
  const newLists = { ...state.lists };
  delete newLists[listId];
  const nextId = getNextId(listId, state.lists);
  ops.dispatch(
    setState({
      lists: newLists,
      navigationState: {
        ...state.navigationState,
        listId: nextId
      }
    })
  );
});
