// @flow
import React from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { connect } from "react-redux";
import { Card, colors } from "@src/styles";
import type { WithDispatch } from "@src/store";
import * as Types from "@src/types";
import * as AppActions from "./actions";
import * as CurrentListActions from "./current_list_actions";
import TabContent from "./TabContent";

type Props = {
  lists: { [string]: Types.List },
  currentList: ?Types.List,
  currentListId: ?string
};

const mapStateToProps = (state: Types.AppState): Props => ({
  lists: state.lists,
  currentList: CurrentListActions._selectCurrentList(state),
  currentListId: state.navigationState.listId
});

class App extends React.Component<WithDispatch<Props>> {
  renderTabBar() {
    return (
      <TabBar>
        {Object.keys(this.props.lists).map(listId => (
          <ListTab
            key={listId}
            isActive={listId === this.props.currentListId}
            onClick={() => this.props.dispatch(AppActions.focusList(listId))}
          >
            {listId}
          </ListTab>
        ))}
        <NewTab
          onClick={() => this.props.dispatch(AppActions.addNewListAndFocus())}
        />
      </TabBar>
    );
  }

  renderContent() {
    if (this.props.currentList == null) {
      return <div>Something went wrong!</div>;
    }
    if (Object.keys(this.props.lists).length === 0) {
      return (
        <ContentDiv>
          <AddNewMessage
            onClick={() => this.props.dispatch(AppActions.addNewListAndFocus())}
          />
        </ContentDiv>
      );
    }
    return (
      <ContentDiv>
        <TabContent
          list={this.props.currentList}
          listId={this.props.currentListId}
        />
      </ContentDiv>
    );
  }

  render() {
    return (
      <Body>
        <Header>
          <h1>Flow + React + Redux</h1>
          <a href={"https://github.com/sleexyz/flow-react-redux-example"}>
            (source)
          </a>
        </Header>
        {this.renderTabBar()}
        {this.renderContent()}
      </Body>
    );
  }
}

export default connect(mapStateToProps)(App);

const Body = styled.div`
  margin: 60px 20vw;
  height: calc(60vh - 100px);
  width: 60vw;
  font-family: monospace;
`;

const Header = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const tabBarHeight = "30px";
const TabBar = styled.div`
  display: flex;
  height: ${tabBarHeight};
  width: 100%;
`;

const ContentDiv = styled.div`
  height: calc(100% - ${tabBarHeight});
  overflow-y: auto;
  ${Card()};
  border-top: 0.5px solid #aaaaaa;
`;

const AddNewMessage = styled.div`
  margin-top: 10%;
  text-align: center;
  cursor: pointer;
  &::before {
    font-size: 2em;
    content: "Add a new List!";
    opacity: 0.5;
  }
`;

const Tab = css`
  padding: 5px;
  border: 0.5px solid #aaaaaa;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
  margin-right: 1px;
  flex: 0 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const ListTab = styled.div`
  background: ${props => (props.isActive ? colors.white : colors.grey)};
  color: ${props => (props.isActive ? colors.black : colors.white)};
  ${Tab};
  box-shadow: ${props =>
    props.isActive ? `0 1px 0 0 ${colors.white}` : "none"};
`;

const NewTab = styled.div`
  background: ${colors.blue};
  color: ${colors.white};
  width: 20px;
  height: auto;
  text-align: center;
  &::before {
    font-weight: bold;
    content: "+";
  }
  ${Tab};
`;
