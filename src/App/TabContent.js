// @flow
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import type { WithDispatch } from "@src/store";
import type { List } from "@src/types";
// TODO: qualify imports
import {
  deleteTodo,
  setTodoContent,
  addTodo
} from "@src/App/current_list_actions";
import { deleteListAndFocusToNextList } from "@src/App/actions";
import TodoRow from "@src/App/TodoRow";

class TabContent extends React.Component<
  WithDispatch<{
    list: List,
    listId: string
  }>
> {
  render() {
    const todos = Object.keys(this.props.list.todos).map(todoId => {
      const todo = this.props.list.todos[todoId];
      return (
        <TodoRow
          key={todoId}
          onChange={(content: string) =>
            this.props.dispatch(setTodoContent({ todoId, content }))}
          onDelete={() => void this.props.dispatch(deleteTodo(todoId))}
          content={todo.content}
        />
      );
    });
    return (
      <Page>
        <Body>
          <Content>
            {todos}
            <AddTodo onClick={() => this.props.dispatch(addTodo())} />
          </Content>
        </Body>
        <Footer>
          <DeleteList
            onClick={() =>
              this.props.dispatch(
                deleteListAndFocusToNextList(this.props.listId)
              )}
          />
        </Footer>
      </Page>
    );
  }
}

export default connect()(TabContent);

const Page = styled.div`
  padding-top: 20px;
  height: calc(100% - 20px);
`;

const Footer = styled.div`
  height: 20%;
  display: flex;
  align-items: center;
`;

const DeleteList = styled.div`
  width: calc(100% - 20px);
  padding-right: 20px;
  cursor: pointer;
  text-align: right;
  &::before {
    opacity: 0.5;
    content: "X - Delete List";
  }
`;

const Body = styled.div`
  height: 80%;
  overflow-y: auto;
`;

const Content = styled.div`
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  & > * {
    margin: 2px 0;
  }
`;

const AddTodo = styled.div`
  cursor: pointer;
  &::before {
    opacity: 0.5;
    content: "+ Add Todo";
  }
`;
