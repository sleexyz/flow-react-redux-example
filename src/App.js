// @flow
import React from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { Card, colors } from "./styles.js";
import { connect } from "react-redux";
import type { AppState } from "./store";
import { selectCurrentList } from "./store/current_list";
import { TabContent } from "./TabContent";
import * as Actions from "./actions";
import type { List } from "./types";

const Body = styled.div`
  ${Card()};
  margin: 20vh 20vw;
  height: 60vh;
  width: 60vw;
`;

const TabBar = styled.div`display: flex;`;

const Tab = css`
  padding: 5px;
  border: 0.5px solid #aaaaaa;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
  margin-right: 1px;
`;

const ListTab = styled.div`
  background: ${props => (props.isActive ? colors.white : colors.grey)};
  color: ${props => (props.isActive ? colors.black : colors.white)};
  ${Tab};
`;

const NewTab = styled.div`
  background: ${colors.blue};
  color: ${colors.white};
  width: 10px;
  height: auto;
  &::before {
    font-weight: bold;
    content: "+";
  }
  ${Tab};
`;

type Props = {
  dispatch: Function,
  lists: { [string]: List },
  currentList: ?List,
  currentListId: ?string
};

const mapStateToProps = (state: AppState) => ({
  lists: state.lists,
  currentList: selectCurrentList(state),
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
        <ListTab
          key={listId}
          isActive={isActive}
          onClick={() => this.props.dispatch(Actions.focusList(listId))}
        >
          {listId}
        </ListTab>
      );
    });
    return (
      <TabBar>
        {tabs}
        <NewTab
          onClick={() => this.props.dispatch(Actions.addNewListAndFocus())}
        />
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
