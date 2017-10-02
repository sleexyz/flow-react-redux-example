// @flow

import React from "react";
import { mount } from "enzyme";
import "jest-enzyme";
import "jest-styled-components";
import { Provider } from "react-redux";
import { App, Body } from "./App";
import { makeStore } from "@src/store";

const mountElement = element => {
  return mount(<Provider store={makeStore()}>{element}</Provider>);
};

describe("App", () => {
  it("renders an app", () => {
    const wrapper = mountElement(<App />);
    expect(wrapper.find(Body)).toHaveLength(1);
  });
});
