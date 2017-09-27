// @flow

type Store<State> = {
  +getState: void => State,
  +dispatch: <A, B>(((Store<State>) => B) | { type: string }) => B
};

export type Action<State, A, B> = A => (Store<State>) => B;

export function makeAction<State, A, B>(
  rawAction: Action<State, A, B>
): Action<State, A, B> {
  return rawAction;
}

export const safeThunk = <State>(store: Store<State>) => (next: any) => (
  actionResult: any
) => {
  if (typeof actionResult === "function") {
    return actionResult(store);
  }
  return next(actionResult);
};

export type WithDispatch<A: {}> = {
  ...$Exact<A>,
  dispatch: <B>((any) => B) => B
};
