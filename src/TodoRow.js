// @flow
import React from "react";
import styled from "styled-components";

const Body = styled.div`display: flex;`;

const Delete = styled.div`
  &::before {
    content: "X";
    margin-right: 5px;
    opacity: .5;
  }
`;

const Input = styled.input`flex: 1 0 auto;`;

function throttle(fn: void => void): void => void {
  let shouldRun = true;
  return value => {
    if (shouldRun) {
      setTimeout(() => {
        fn();
        shouldRun = true;
      }, 1000);
      shouldRun = false;
    }
  };
}

type Props = {
  content: string,
  onChange: string => void,
  onDelete: void => void
};

export class TodoRow extends React.Component {
  props: Props;
  state: {
    content: string
  };
  constructor(props: Props) {
    super();
    this.state = {
      content: props.content
    };
  }
  onContentChange = (e: *) => {
    this.setState({ content: e.target.value });
    this.updateContentOnRedux();
  };
  updateContentOnRedux = throttle(() => {
    this.props.onChange(this.state.content);
  });
  render() {
    return (
      <Body>
        <Delete onClick={this.props.onDelete} />
        <Input value={this.state.content} onChange={this.onContentChange} />
      </Body>
    );
  }
}
