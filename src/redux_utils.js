// @flow

import Callable from "callable-class";

export type Ops<State, Env> = {
  env: Env,
  setState: State => void,
  getState: void => State,
  modifyState: ((State) => State) => void,
  dispatch: <A, B>(Action<State, Env, A, B>) => B
};

type Reducer<State> = (State, *) => State;

export const makeReducer = <State>(initialState: State): Reducer<State> => (
  state: State = initialState,
  action: *
): State => {
  if (action.type === "setState") {
    return action.payload;
  }
  return state;
};

export type Action<State, Env, A, B> = {
  type: string,
  sourceActionCreator: ActionCreator<State, Env, A, B>,
  parentAction?: *,
  childActions?: Array<*>,
  run: (Ops<State, Env>) => B,
  result?: B
};

export class ActionCreator<State, Env, A, B> extends Callable<
  A,
  Action<State, Env, A, B>
> {
  actionName: string;
  constructor(actionName: string, f: A => (Ops<State, Env>) => B) {
    let getThis;
    super(payload => ({
      run: ops => f(payload)(ops),
      sourceActionCreator: getThis(),
      type: actionName
    }));
    getThis = () => this;
    this.actionName = actionName;
  }
}

type SetStateAction<State, Env> = {
  type: "setState",
  payload: State,
  parentAction: Action<State, Env, *, *>
};

export const hijackDispatch = <State, Env>({ env }: { env: Env }) => ({
  getState,
  dispatch
}: *) => (next: *) => (action: Action<State, Env, any, any>) => {
  if (action.type === "setState") {
    return next(action);
  }
  if (typeof action.run === "function") {
    const ops: Ops<State, Env> = {
      env,
      getState,
      dispatch: childAction => {
        Object.assign(childAction, { parentAction: action });
        if (action.childActions == null) {
          action.childActions = [];
        }
        action.childActions.push(childAction);
        return dispatch(childAction);
      },
      setState: payload => {
        const setStateAction: SetStateAction<State, Env> = {
          type: "setState",
          payload,
          parentAction: action
        };
        if (action.childActions == null) {
          action.childActions = [];
        }
        action.childActions.push(setStateAction);
        return dispatch(setStateAction);
      },
      modifyState: (stateModifier: State => State) => {
        return ops.setState(stateModifier(ops.getState()));
      }
    };
    Object.assign(action, { result: action.run(ops) });
    return next(action).result;
  }
  return next(action);
};
