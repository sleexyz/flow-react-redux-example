// @flow
import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";

import App from "@src/App";
import { makeStore } from "@src/store";

const globalStore = makeStore();

const renderApp = () => {
  const elem = (
    <Provider store={globalStore}>
      <App />
    </Provider>
  );
  ReactDOM.render(elem, document.getElementById("root"));
};

renderApp();

if (module.hot) {
  (module.hot: any).accept(undefined, renderApp);
}
