// @flow
/* eslint no-unused-vars: 0 */
import { applyMiddleware, createStore } from "redux";
import React from "react";

import * as ReduxUtils from "./";

/*
    Store Code
  */

type AppState = {
  counter: number
};

const initialAppState = {
  counter: 1
};

type Action<A, B> = ReduxUtils.Action<AppState, A, B>;

function makeAction<A, B>(action: Action<A, B>): Action<A, B> {
  return ReduxUtils.makeAction(action);
}

const reducer = (state: AppState, action: any): AppState => {
  if (action.type === "setState") {
    return action.payload;
  }
  return state;
};

function setState(payload: AppState) {
  return {
    type: "setState",
    payload
  };
}

/*
    Actions Code
  */

const getNumber: Action<void, number> = makeAction(num => store => {
  const state = store.getState();
  return state.counter;
});

const add1: Action<number, void> = makeAction(num => store => {
  const state = store.getState();
  store.dispatch(setState({ ...state, counter: state.counter + num }));
});

const add2: Action<number, void> = makeAction(num => store => {
  const state = store.getState();
  // $FlowFixMe
  state.as(); // error: `as` doesn't exist
  // $FlowFixMe
  store.asdf(); // error: `asdf` is not a valid op
  // $FlowFixMe
  store.setState(); // error: invalid State
  // $FlowFixMe
  num.asdf(); // error: invalid access of input type
  // $FlowFixMe
  return 2; // error: invalid output
});

/*
   Store Initialization Code
*/

const store = createStore(
  reducer,
  initialAppState,
  applyMiddleware(ReduxUtils.safeThunk)
);

/*
  Component Code
*/

type Props = {
  foo: number
};

class MyComponent extends React.Component<ReduxUtils.WithDispatch<Props>> {
  render() {
    (this.props.foo: number);
    this.props.dispatch(add1(999)); // ok
    (this.props.dispatch(getNumber()): number); // ok

    // $FlowFixMe
    (this.props.foo: string); // error: not a string
    // $FlowFixMe
    this.props.dispatch(add1("fail")); // error: invalid payload
    // $FlowFixMe
    this.props.dispatch(add1()); // error: undefined payload
    // $FlowFixMe
    (this.props.dispatch(getNumber(1)): number); // error: invalid payload
    // $FlowFixMe
    (this.props.dispatch(getNumber()): string); // error: wrong return type

    return <div />;
  }
}
