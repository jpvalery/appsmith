import { AppState } from "reducers";
import { createSelector } from "reselect";

export const getIsOnboardingHelperVisible = (state: AppState) => {
  const urlSearchParams = new URL(window.location.href).searchParams;
  const isCommentModeInUrl = urlSearchParams.get("isCommentMode");
  return state.ui.onBoarding.showHelper && !isCommentModeInUrl;
};

export const showWelcomeScreen = (state: AppState) =>
  state.ui.onBoarding.showOnboardingLoader;
export const getEnableFirstTimeUserOnboarding = (state: AppState) => {
  return state.ui.onBoarding.enableFirstTimeUserOnboarding;
};

export const getFirstTimeUserOnboardingApplicationId = (state: AppState) => {
  return state.ui.onBoarding.firstTimeUserOnboardingApplicationId;
};

export const getFirstTimeUserOnboardingComplete = (state: AppState) => {
  return state.ui.onBoarding.firstTimeUserOnboardingComplete;
};

export const getFirstTimeUserOnboardingModal = (state: AppState) =>
  state.ui.onBoarding.showFirstTimeUserOnboardingModal;

export const getIsFirstTimeUserOnboardingEnabled = createSelector(
  (state: AppState) => state.entities.pageList.applicationId,
  getEnableFirstTimeUserOnboarding,
  getFirstTimeUserOnboardingApplicationId,
  (currentApplicationId, enabled, applicationId) => {
    return enabled && currentApplicationId === applicationId;
  },
);

export const getIsInOnboarding = (state: AppState) =>
  state.ui.onBoarding.inOnboarding;
