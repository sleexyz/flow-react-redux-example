// @flow
import React from "react";
import { connect } from "react-redux";
import type { WithDispatch } from "./store";
import type { List } from "./types";
import styled from "styled-components";
import { deleteTodo, setTodoContent, addTodo } from "./store/current_list";
import { TodoRow } from "./TodoRow";

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  & > * {
    margin: 2px 0;
  }
`;

const AddTodo = styled.div`
  &::before {
    opacity: 0.5;
    content: "+ Add Todo";
  }
`;

class TabContentInner extends React.Component {
  props: WithDispatch<{
    list: List,
    listId: string
  }>;
  render() {
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
      <Body>
        {todos}
        <AddTodo onClick={() => this.props.dispatch(addTodo())} />
      </Body>
    );
  }
}
export const TabContent = connect()(TabContentInner);
