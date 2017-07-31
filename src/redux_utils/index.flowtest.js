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

const initialState = {
  counter: 1
};

class ActionCreator<A, B> extends ReduxUtils.ActionCreator<AppState, A, B> {}

/*
    Actions Code
  */

const getNumber: ActionCreator<
  void,
  number
> = new ActionCreator("addTest", num => ops => {
  const state = ops.getState();
  return state.counter;
});

const add1: ActionCreator<
  number,
  void
> = new ActionCreator("addTest", num => ops => {
  const state = ops.getState();
  ops.setState({ ...state, counter: state.counter + num });
});

const add2: ActionCreator<
  number,
  void
> = new ActionCreator("addTest", num => ops => {
  const state = ops.getState();
  // $FlowFixMe
  state.as(); // error: `as` doesn't exist
  // $FlowFixMe
  ops.asdf(); // error: `asdf` is not a valid op
  // $FlowFixMe
  ops.setState(); // error: invalid State
  // $FlowFixMe
  num.asdf(); // error: invalid access of input type
  // $FlowFixMe
  return 2; // error: invalid output
});

/*
   Store Initialization Code
*/

const store = createStore(
  ReduxUtils.makeReducer(initialState),
  applyMiddleware(ReduxUtils.hijackDispatch)
);

/*
  Component Code
*/

type Props = {
  foo: number
};

class MyComponent extends React.Component {
  props: ReduxUtils.WithDispatch<Props>;
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
