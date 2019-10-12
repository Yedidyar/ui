import React, { Component, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Tree as BaseTree,
  Button,
  Tag,
  Intent,
  Alignment,
  ContextMenu,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import { GroupFacade } from './props';
import { useGroups, useSharing } from './hooks/vault';
import { PaneContainer, PaneHeader, PaneContent, PaneFooter } from './Pane';
import { getThemeProp } from '../../utils';

const Tree = styled(BaseTree)`
  .node {
    &[class*='node-selected'] {
      > [class*='node-content'] {
        background-color: ${props =>
          getThemeProp(props, 'tree.selectedBackgroundColor')} !important;
        color: ${props => getThemeProp(props, 'tree.selectedTextColor')};
        > [icon] {
          color: ${props => getThemeProp(props, 'tree.selectedIconColor')} !important;
        }
      }
    }
    > [class*='node-content'] {
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        background-color: ${props => getThemeProp(props, 'tree.hoverBackgroundColor')};
      }
    }
  }
`;

const GroupsList = () => {
  const {
    groups,
    selectedGroupID,
    onSelectGroup,
    expandedGroups,
    handleCollapseGroup,
    handleExpandGroup,
    filters,
    onGroupFilterTermChange,
    onGroupFilterSortModeChange,
    trashCount,
    trashSelected,
    trashID
  } = useGroups();
  const { onRequestShareOptions, setShareDialogOpen, sharingEnabled } = useSharing();

  const showContextMenu = (node, nodePath, evt) => {
    evt.preventDefault();
    ContextMenu.show(
      <Menu>
        <Choose>
          <When condition={node.isTrash}>
            <MenuItem disabled text="Can't modify Trash group" />
          </When>
          <Otherwise>
            <MenuItem
              disabled={!sharingEnabled}
              icon="share"
              text="Share"
              onClick={() => {
                setShareDialogOpen(true);
                onRequestShareOptions();
              }}
            />
          </Otherwise>
        </Choose>
      </Menu>,
      { left: evt.clientX, top: evt.clientY },
      () => {}
    );
  };

  return (
    <PaneContainer primary>
      <PaneHeader
        title="Groups"
        count={groups.length}
        filter={filters}
        onTermChange={term => onGroupFilterTermChange(term)}
        onSortModeChange={sortMode => onGroupFilterSortModeChange(sortMode)}
      />
      <PaneContent>
        <Tree
          contents={groups}
          onNodeClick={group => onSelectGroup(group.id)}
          onNodeContextMenu={showContextMenu}
          onNodeExpand={handleExpandGroup}
          onNodeCollapse={handleCollapseGroup}
        />
      </PaneContent>
      <PaneFooter>
        <Button
          rightIcon={
            <Tag round minimal intent={trashCount > 0 ? Intent.WARNING : Intent.NONE}>
              {trashCount}
            </Tag>
          }
          icon="trash"
          fill
          minimal
          text="Trash"
          alignText={Alignment.LEFT}
          active={trashSelected}
          onClick={() => onSelectGroup(trashID)}
        />
      </PaneFooter>
    </PaneContainer>
  );
};

export default GroupsList;
