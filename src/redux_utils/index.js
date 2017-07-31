// @flow
import Callable from "callable-class";

export type Ops<State> = {
  setState: State => void,
  getState: void => State,
  modifyState: ((State) => State) => void,
  dispatch: <A, B>(Action<State, A, B>) => B
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

export type Action<State, A, B> = {
  type: string,
  sourceActionCreator: ActionCreator<State, A, B>,
  parentAction?: *,
  childActions?: Array<*>,
  run: (Ops<State>) => B,
  result?: B
};

export class ActionCreator<State, A, B> extends Callable<
  A,
  Action<State, A, B>
> {
  actionName: string;
  constructor(actionName: string, f: A => (Ops<State>) => B) {
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

type SetStateAction<State> = {
  type: "setState",
  payload: State,
  parentAction: Action<State, *, *>
};

export const hijackDispatch = <State>({
  getState,
  dispatch
}: *) => (next: *) => (action: Action<State, any, any>) => {
  if (action.type === "setState") {
    return next(action);
  }
  if (typeof action.run === "function") {
    const ops: Ops<State> = {
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
        const setStateAction: SetStateAction<State> = {
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

// For interfacing with components
export type WithDispatch<A: {}> = A & {
  dispatch: <B>(Action<*, *, B>) => B
};
