// @flow
import React from "react";
import styled from "styled-components";

import {
  type WithContainerProps,
  safeConnect,
  type SafeConnect
} from "@src/store";
import type { List } from "@src/types";
import { deleteTodo, setTodoContent, addTodo } from "@src/state/current_list";
import * as App from "@src/state/app";
import { TodoRow } from "@src/components/TodoRow";

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
    opacity: .5;
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

type ContainerProps = {
  foo: string
};

const mapStateToProps = x => ({ foo: "hello" });

type Props = WithContainerProps<
  ContainerProps,
  {
    list: List,
    listId: string
  }
>;

class TabContentInner extends React.Component {
  props: Props;
  render() {
    this.props.foo;
    const todos = Object.keys(this.props.list.todos).map(todoId => {
      const todo = this.props.list.todos[todoId];
      return (
        <TodoRow
          key={todoId}
          onChange={(content: string) =>
            void this.props.dispatch(setTodoContent({ todoId, content }))}
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
                App.deleteListAndFocusToNextList(this.props.listId)
              )}
          />
        </Footer>
      </Page>
    );
  }
}

export const TabContent = (safeConnect: SafeConnect<Props, ContainerProps>)(
  mapStateToProps
)(TabContentInner);
