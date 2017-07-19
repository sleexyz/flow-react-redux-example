// @flow
import React from "react";
import { connect } from "react-redux";
import type { List } from "./types";
import styled from "styled-components";

const AddTodo = styled.div`
  &::before {
    content: "+ Add Todo";
  }
`;

type Props = {
  list: List,
  listId: string
};

class TabContentInner extends React.Component {
  props: Props;
  render() {
    const todos = this.props.list.todos.map((todo, i) =>
      <div key={i}>
        {JSON.stringify(todo)}
      </div>
    );
    return (
      <div>
        {todos}
        <AddTodo />
      </div>
    );
  }
}
export const TabContent = connect()(TabContentInner);
