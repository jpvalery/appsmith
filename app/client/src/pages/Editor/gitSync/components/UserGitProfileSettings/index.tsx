import React from "react";
import { Space } from "../StyledComponents";
import {
  createMessage,
  USER_PROFILE_SETTINGS_TITLE,
  AUTHOR_NAME,
  AUTHOR_EMAIL,
} from "constants/messages";
import styled from "styled-components";
import TextInput from "components/ads/TextInput";
import { Classes as GitSyncClasses } from "../../constants";

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;

  .${GitSyncClasses.OPTION_SELECTOR_WRAPPER} {
    display: flex;
    align-items: center;
    padding-top: 5px;
  }
`;

const MainContainer = styled.div`
  width: calc(100% - 30px);
`;

type AuthorInfo = { authorName: string; authorEmail: string };

const AUTHOR_INFO_LABEL = {
  EMAIL: "authorEmail",
  NAME: "authorName",
};

// Component
type UserGitProfileSettingsProps = {
  authType: string;
  authorInfo: AuthorInfo;
  setAuthorInfo: (authorInfo: AuthorInfo) => void;
};

function UserGitProfileSettings({
  authorInfo,
  setAuthorInfo,
}: UserGitProfileSettingsProps) {
  const isValidRemoteURL = true;

  const setAuthorState = (label: string, value: string) => {
    switch (label) {
      case AUTHOR_INFO_LABEL.NAME:
        setAuthorInfo({
          authorEmail: authorInfo.authorEmail,
          authorName: value,
        });
        break;
      case AUTHOR_INFO_LABEL.EMAIL:
        setAuthorInfo({
          authorEmail: value,
          authorName: authorInfo.authorName,
        });
        break;
      default:
        break;
    }
  };

  return (
    <MainContainer>
      <TitleWrapper>
        <span className="label">
          {createMessage(USER_PROFILE_SETTINGS_TITLE)}
        </span>
      </TitleWrapper>

      <Space size={7} />
      {isValidRemoteURL ? (
        <>
          <LabelContainer>
            <span className="label">{createMessage(AUTHOR_NAME)}</span>
          </LabelContainer>
          <InputContainer>
            <TextInput
              dataType="text"
              fill
              onChange={(value) =>
                setAuthorState(AUTHOR_INFO_LABEL.NAME, value)
              }
              value={authorInfo.authorName}
            />
          </InputContainer>

          <Space size={7} />

          <LabelContainer>
            <span className="label">{createMessage(AUTHOR_EMAIL)}</span>
          </LabelContainer>
          <InputContainer>
            <TextInput
              dataType="email"
              fill
              onChange={(value) =>
                setAuthorState(AUTHOR_INFO_LABEL.EMAIL, value)
              }
              value={authorInfo.authorEmail}
            />
          </InputContainer>
        </>
      ) : null}
    </MainContainer>
  );
}

export default UserGitProfileSettings;
