// @flow
import React from "react";
import styled from "styled-components";
import { Card, colors } from "./styles.js";
import { connect } from "react-redux";
import * as Store from "./store";
import { TabContent } from "./TabContent";
import type { List } from "./types";

const Body = styled.div`
  ${Card()};
  margin: 20vh 20vw;
  height: 60vh;
  width: 60vw;
`;

const TabBar = styled.div`display: flex;`;

const ListTab = styled.div`
  background: ${props => (props.isActive ? colors.blue : colors.white)};
  color: ${props => (props.isActive ? colors.white : colors.black)};
  padding: 5px;
`;

type Props = {
  dispatch: Function,
  lists: { [string]: List },
  currentList: ?List,
  currentListId: ?string
};

const mapStateToProps = (state: Store.AppState) => ({
  lists: state.lists,
  currentList: Store.selectCurrentList(state),
  currentListId: state.navigationState.listId
});

class AppInner extends React.Component {
  props: Props;

  render() {
    if (Object.keys(this.props.lists).length > 0) {
      return (
        <Body>
          {this.renderTabBar()}
          {this.renderTabContent()}
        </Body>
      );
    } else {
      throw new Error("IMPLEMENT");
    }
  }

  renderTabBar() {
    const tabs = Object.keys(this.props.lists).map(listId => {
      const isActive = listId === this.props.currentListId;
      return (
        <ListTab key={listId} isActive={isActive}>
          {listId}
        </ListTab>
      );
    });
    return (
      <TabBar>
        {tabs}
      </TabBar>
    );
  }

  renderTabContent() {
    if (this.props.currentList == null) {
      throw new Error("IMPLEMENT");
    }
    const props = {
      list: this.props.currentList,
      listId: this.props.currentListId
    };
    return <TabContent {...props} />;
  }
}

export const App = connect(mapStateToProps)(AppInner);
