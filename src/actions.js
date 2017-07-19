// @flow
import type { List } from "./types";
import { ActionCreator } from "./store";

export const addList: ActionCreator<
  List,
  string
> = new ActionCreator("addList", newList => ops => {
  const state = ops.getState();
  ops.setState({ ...state, lists: { ...state.lists, newList } });
  return "newList";
});

export const focusList: ActionCreator<
  string,
  void
> = new ActionCreator("focusList", listId => ops => {
  const state = ops.getState();
  ops.setState({
    ...state,
    navigationState: { ...state.navigationState, currentList: listId }
  });
});

export const addNewListAndFocus: ActionCreator<
  void,
  void
> = new ActionCreator("addNewListAndFocus", () => ops => {
  const newList = {
    todos: []
  };
  const listId = ops.dispatch(addList(newList));
  ops.dispatch(focusList(listId));
});