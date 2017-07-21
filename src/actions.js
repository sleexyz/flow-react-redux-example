// @flow
import pushid from "pushid";

import type { List } from "@src/types";
import { ActionCreator } from "@src/store";

export const addList: ActionCreator<
  List,
  string
> = new ActionCreator("addList", newList => ops => {
  const state = ops.getState();
  const newListId = pushid();
  ops.setState({ ...state, lists: { ...state.lists, [newListId]: newList } });
  return newListId;
});

export const focusList: ActionCreator<
  string,
  void
> = new ActionCreator("focusList", listId => ops => {
  const state = ops.getState();
  ops.setState({
    ...state,
    navigationState: { ...state.navigationState, listId }
  });
});

export const addNewListAndFocus: ActionCreator<
  void,
  void
> = new ActionCreator("addNewListAndFocus", () => ops => {
  const newList = {
    todos: {}
  };
  const listId = ops.dispatch(addList(newList));
  ops.dispatch(focusList(listId));
});
