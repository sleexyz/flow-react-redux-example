// @flow
import React from "react";
import { connect } from "react-redux";
import { List } from "./types";

type Props = {
  list: List,
  listId: string
}

class TabContentInner extends React.Component {
  props: Props
  render() {
    return <div>hello</div>;
  }
}
export const TabContent = connect()(TabContentInner);

