import React, { memo, ReactElement } from "react";
import EntityPlaceholder from "../Entity/Placeholder";
import Entity from "../Entity";
import { jsIcon, jsFileIcon } from "../ExplorerIcons";
import ExplorerJSCollectionEntity from "./JSActionEntity";
import { createNewJSCollection } from "actions/jsPaneActions";
import { useDispatch } from "react-redux";
import { JSCollectionData } from "reducers/entityReducers/jsActionsReducer";

type ExplorerJSCollectionGroupProps = {
  pageId: string;
  step: number;
  jsActions?: JSCollectionData[];
  searchKeyword?: string;
};

export const ExplorerJSCollectionGroup = memo(
  (props: ExplorerJSCollectionGroupProps) => {
    const emptyNode = (
      <EntityPlaceholder step={props.step + 1}>
        No JS Objects yet. Please click the <strong>+</strong> icon on above, to
        create.
      </EntityPlaceholder>
    );
    const jsActions = props.jsActions || [];
    const childNode: ReactElement<ExplorerJSCollectionGroupProps> = (
      <>
        {jsActions.map((js: JSCollectionData) => {
          return (
            <ExplorerJSCollectionEntity
              action={js}
              icon={jsFileIcon}
              key={js.config.id}
              pageId={props.pageId}
              searchKeyword={props.searchKeyword}
              step={props.step + 1}
            />
          );
        })}
      </>
    );
    const dispatch = useDispatch();
    return (
      <Entity
        className={"js_actions"}
        disabled={!props.jsActions && !!props.searchKeyword}
        entityId={props.pageId + "_jsAction"}
        icon={jsIcon}
        isDefaultExpanded
        key={props.pageId + "_jsAction"}
        name="JS Objects"
        onCreate={() => dispatch(createNewJSCollection(props.pageId))}
        searchKeyword={props.searchKeyword}
        step={props.step}
      >
        {!props.jsActions?.length ? emptyNode : childNode}
      </Entity>
    );
  },
);

ExplorerJSCollectionGroup.displayName = "ExplorerJSCollectionGroup";
(ExplorerJSCollectionGroup as any).whyDidYouRender = {
  logOnDifferentValues: false,
};

export default ExplorerJSCollectionGroup;
