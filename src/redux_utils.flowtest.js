// @flow
/* eslint no-unused-vars: 0 */

import { applyMiddleware, createStore } from "redux";
import * as ReduxUtils from "./redux_utils";

/*
   Service Code
  */

type Env = {
  logService: {
    log: mixed => void
  }
};

const makeEnv = (): Env => ({
  logService: {
    log: () => {}
  }
});

/*
    Store Code
  */

type AppState = {
  counter: number
};

const initialState = {
  counter: 1
};

class ActionCreator<A, B> extends ReduxUtils.ActionCreator<
  AppState,
  Env,
  A,
  B
> {}

/*
    Actions Code
  */

const add1: ActionCreator<
  number,
  void
> = new ActionCreator("addTest", num => ops => {
  const state = ops.getState();
  ops.setState({ ...state, counter: state.counter + num });
  ops.env.logService.log("hello");
});

const add2: ActionCreator<
  number,
  void
> = new ActionCreator("addTest", num => ops => {
  const state = ops.getState();
  // $FlowFixMe
  state.as(); // `as` doesn't exist
  // $FlowFixMe
  ops.asdf(); // `asdf` is not a valid op
  // $FlowFixMe
  ops.setState(); // invalid State
  // $FlowFixMe
  num.asdf(); // invalid access of input type
  // $FlowFixMe
  ops.env.logService.asdfasdfd("hello"); // invalid env
  // $FlowFixMe
  return 2; // invalid output
});

/*
   Store Initialization Code
*/

const store = createStore(
  ReduxUtils.makeReducer(initialState),
  applyMiddleware(
    ReduxUtils.hijackDispatch({
      env: makeEnv()
    })
  )
);

/*
  Component Code
*/

const correct = add1(999);
// $FlowFixMe
const incorrect1 = add1("fail"); // invalid payload
// $FlowFixMe
const incorrect2 = add1(); // undefined payload
