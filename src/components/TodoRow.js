// @flow
import React from "react";
import styled from "styled-components";

const Body = styled.div`display: flex;`;

const Delete = styled.div`
  cursor: pointer;
  &::before {
    content: "X";
    margin-right: 5px;
    opacity: 0.5;
  }
`;

const Input = styled.input`flex: 1 0 auto;`;

function throttle(fn: void => void): void => void {
  let shouldRun = true;
  let shouldRunOnTimeout = false;
  return () => {
    if (shouldRun) {
      fn();
      setTimeout(() => {
        shouldRun = true;
        if (shouldRunOnTimeout) {
          fn();
        }
        shouldRunOnTimeout = false;
      }, 1000);
      shouldRun = false;
      shouldRunOnTimeout = false;
    } else {
      shouldRunOnTimeout = true;
    }
  };
}

type Props = {
  content: string,
  onChange: string => void,
  onDelete: void => void
};

type State = {
  content: string
};

export class TodoRow extends React.Component<Props, State> {
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
