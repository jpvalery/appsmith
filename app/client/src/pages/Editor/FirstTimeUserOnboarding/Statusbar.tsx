import { Icon } from "@blueprintjs/core";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import { getOnboardingCheckListUrl } from "constants/routes";
import { useIsWidgetActionConnectionPresent } from "pages/Editor/utils";
import React, { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getEvaluationInverseDependencyMap } from "selectors/dataTreeSelectors";
import {
  getApplicationLastDeployedAt,
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import {
  getCanvasWidgets,
  getDatasources,
  getPageActions,
} from "selectors/entitiesSelector";
import { getFirstTimeUserOnboardingComplete } from "selectors/onboardingSelectors";
import styled from "styled-components";
import history from "utils/history";
import {
  ONBOARDING_STATUS_STEPS_FIRST,
  ONBOARDING_STATUS_STEPS_FIRST_ALT,
  ONBOARDING_STATUS_STEPS_SECOND,
  ONBOARDING_STATUS_STEPS_THIRD,
  ONBOARDING_STATUS_STEPS_FOURTH,
  ONBOARDING_STATUS_STEPS_FIVETH,
  ONBOARDING_STATUS_STEPS_SIXTH,
  ONBOARDING_STATUS_GET_STARTED,
  createMessage,
} from "constants/messages";
import { getTypographyByKey } from "constants/DefaultTheme";
import { useIntiateOnboarding } from "components/editorComponents/Onboarding/utils";

const Wrapper = styled.div<{ active: boolean }>`
  position: relative;
  width: 100%;
  background-color: ${(props) =>
    props.active ? props.theme.colors.welcomeTourStickySidebarBackground : ""};
  cursor: ${(props) => (props.active ? "default" : "pointer")};
  height: 83px;
  padding: 10px 16px;
  transition: background-color 0.3s ease;

  &:hover .hover-icons {
    opacity: 1;
  }
`;

const TitleWrapper = styled.p`
  color: #fff;
  ${(props) => getTypographyByKey(props, "p4")}
`;

const StatusText = styled.p`
  color: #fff;
  font-size: 13px;
  & .hover-icons {
    transform: translate(3px, 0px);
    opacity: 0;
  }
`;

const ProgressContainer = styled.div`
  background-color: rgb(255, 255, 255, 0.35);
  border-radius: ${(props) => props.theme.radii[3]}px;
  overflow: hidden;
  margin-top: 12px;
`;

const Progressbar = styled.div<StatusProgressbarType>`
  width: ${(props) => props.percentage}%;
  height: 6px;
  background: ${(props) =>
    props.active
      ? "#fff"
      : props.theme.colors.welcomeTourStickySidebarBackground};
  transition: width 0.3s ease, background 0.3s ease;
  border-radius: ${(props) => props.theme.radii[3]}px;
`;

const StyledClose = styled(Icon)`
  position: absolute;
  top: 15px;
  right: 13px;
  opacity: 0;
`;

type StatusProgressbarType = {
  percentage: number;
  active: boolean;
};

export function StatusProgressbar(props: StatusProgressbarType) {
  return (
    <ProgressContainer>
      <Progressbar {...props} />
    </ProgressContainer>
  );
}

const useStatus = (): { percentage: number; content: string } => {
  const datasources = useSelector(getDatasources);
  const pageId = useSelector(getCurrentPageId);
  const actions = useSelector(getPageActions(pageId));
  const widgets = useSelector(getCanvasWidgets);
  const deps = useSelector(getEvaluationInverseDependencyMap);
  const isConnectionPresent = useIsWidgetActionConnectionPresent(
    widgets,
    actions,
    deps,
  );
  const isDeployed = !!useSelector(getApplicationLastDeployedAt);
  const isFirstTimeUserOnboardingComplete = useSelector(
    getFirstTimeUserOnboardingComplete,
  );

  if (isFirstTimeUserOnboardingComplete) {
    return {
      percentage: 100,
      content: createMessage(ONBOARDING_STATUS_STEPS_SIXTH),
    };
  }

  let content = "";
  let percentage = 0;
  if (!datasources.length && !actions.length) {
    content =
      Object.keys(widgets).length === 1
        ? createMessage(ONBOARDING_STATUS_STEPS_FIRST)
        : createMessage(ONBOARDING_STATUS_STEPS_FIRST_ALT);
  } else if (!actions.length) {
    content = createMessage(ONBOARDING_STATUS_STEPS_SECOND);
  } else if (Object.keys(widgets).length === 1) {
    content = createMessage(ONBOARDING_STATUS_STEPS_THIRD);
  } else if (!isConnectionPresent) {
    content = createMessage(ONBOARDING_STATUS_STEPS_FOURTH);
  } else if (!isDeployed) {
    content = createMessage(ONBOARDING_STATUS_STEPS_FIVETH);
  } else {
    content = createMessage(ONBOARDING_STATUS_STEPS_SIXTH);
  }

  if (datasources.length || actions.length) {
    percentage += 20;
  }

  if (actions.length) {
    percentage += 20;
  }

  if (Object.keys(widgets).length > 1) {
    percentage += 20;
  }

  if (isConnectionPresent) {
    percentage += 20;
  }

  if (isDeployed) {
    percentage += 20;
  }

  return {
    percentage,
    content,
  };
};

export function OnboardingStatusbar(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const applicationId = useSelector(getCurrentApplicationId);
  const pageId = useSelector(getCurrentPageId);
  const { content, percentage } = useStatus();
  const isChecklistPage = props.location.pathname.indexOf("/checklist") > -1;
  const isGenerateAppPage =
    props.location.pathname.indexOf("/generate-page/form") > -1;
  const isFirstTimeUserOnboardingComplete = useSelector(
    getFirstTimeUserOnboardingComplete,
  );
  const intiateOnboarding = useIntiateOnboarding();
  if (isGenerateAppPage) {
    return null;
  }
  const endFirstTimeUserOnboarding = (event?: SyntheticEvent) => {
    event?.stopPropagation();
    dispatch({
      type: ReduxActionTypes.END_FIRST_TIME_USER_ONBOARDING,
    });
    intiateOnboarding();
  };
  if (percentage === 100 && !isFirstTimeUserOnboardingComplete) {
    dispatch({
      type: ReduxActionTypes.SET_ENABLE_FIRST_TIME_USER_ONBOARDING,
      payload: false,
    });
    dispatch({
      type: ReduxActionTypes.SET_FIRST_TIME_USER_ONBOARDING_APPLICATION_ID,
      payload: "",
    });
    dispatch({
      type: ReduxActionTypes.SET_FIRST_TIME_USER_ONBOARDING_COMPLETE,
      payload: true,
    });
  }

  return (
    <Wrapper
      active={isChecklistPage}
      data-testid="statusbar-container"
      onClick={() => {
        history.push(getOnboardingCheckListUrl(applicationId, pageId));
      }}
    >
      <StyledClose
        className="hover-icons"
        color="#fff"
        data-cy="statusbar-skip"
        icon="cross"
        iconSize={14}
        onClick={endFirstTimeUserOnboarding}
      />
      <TitleWrapper>
        {createMessage(ONBOARDING_STATUS_GET_STARTED)}
      </TitleWrapper>
      <StatusText>
        <span data-testid="statusbar-text">{content}</span>&nbsp;&nbsp;
        {!isChecklistPage && (
          <Icon
            className="hover-icons"
            color="#fff"
            icon="chevron-right"
            iconSize={14}
          />
        )}
      </StatusText>
      <StatusProgressbar
        active={isChecklistPage}
        data-testid="statusbar-text"
        percentage={percentage}
      />
    </Wrapper>
  );
}

export default withRouter(OnboardingStatusbar);
