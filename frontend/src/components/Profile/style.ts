import styled, { css, keyframes } from "styled-components";
import FlexBetween from "../UI/FlexBetween";

// ----------------- Animations ---------------------
export const flashLeft = keyframes`
  0% {
    transform: rotate(60deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

export const flashLeftLight = keyframes`
  0% {
    opacity: 0;
    transform: rotate(90deg) translateY(-13px) translateX(13px);
  }
  100% {
    opacity: 1;
    transform: rotate(42deg);
  }
`;

export const flashRight = keyframes`
  0% {
    transform: rotate(220deg);
  }
  100% {
    transform: rotate(270deg);
  }
`;

export const flashRightLight = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-90deg) translateY(13px) translateX(-13px);
  }
  100% {
    opacity: 1;
    transform: rotate(-42deg);
  }
`;

export const profileFlash = keyframes`
  0% {
    box-shadow: -5px 0px 13px var(--profile-color), 5px 0px 13px var(--profile-color);
  }
  100% {
    box-shadow: -5px 0px 13px var(--profile-color), 5px 0px 13px var(--profile-color);
  }
`;

// ----------------- Styled Components ---------------------
export const ProfileContainer = styled(FlexBetween)`
  background-color: var(--profile-background-color);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 3%;
    bottom: 3%;
    right: 0;
    width: 0.125rem;
    border-right: 0.125rem solid var(--profile-color);
  }
`;

export const ProfilePicture = styled.div<{ $url: string }>`
  width: min(20vw, 32vh);
  height: min(20vw, 32vh);
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  animation: ${profileFlash} 1s infinite;
  animation-delay: 0.55s;
  background-image: ${({ $url }) => `url(${$url})`};
`;

export const ProfilePictureContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid var(--profile-color);
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
`;

export const ProfileInputContainer = styled.div`
  width: 89%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

export const InputGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 89%;
  margin: 1.31rem 0;
  position: relative;

  input {
    width: 89%;
    font-size: 1rem;
    padding: 0.81rem 1.31rem;
    outline: none;
    border: 2px solid var(--profile-color);
    background-color: transparent;
    border-radius: 13px;
    color: var(--profile-color);

    &::placeholder {
      opacity: 0.5;
      color: var(--profile-color);
    }
  }

  label {
    background-color: transparent;
    font-size: 0.89rem;
    position: absolute;
    left: 0;
    padding: 0.8rem;
    margin-left: 0.5rem;
    pointer-events: none;
    transition: transform 0.3s ease;
    opacity: 0.5;
    color: var(--profile-color);
  }

  :is(input:focus, input:valid) ~ label {
    transform: translateY(-1.7rem) scale(0.9);
    margin: 0em;
    margin-left: 1.3em;
    padding: 0.18rem;
    opacity: 1;
    color: var(--profile-color);
    background-color: var(--profile-background-color);
  }
`;

export const ProfileLight = styled.div<{ $position: "left" | "right" }>`
  position: absolute;
  ${({ $position }) =>
    $position === "left" &&
    css`
      left: 0;
      bottom: -5px;
      animation: ${flashLeft} 0.55s;
    `}
  ${({ $position }) =>
    $position === "right" &&
    css`
      transform: rotate(270deg);
      right: -1px;
      bottom: -3px;
      animation: ${flashRight} 0.55s;
    `}

  & * {
    font-size: 1.34rem;
    color: var(--profile-color);
  }
`;

export const ProfileHeader = styled.h3`
  color: var(--profile-color);
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1.2rem;
`;

export const ProfileSettingsButton = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1rem;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s ease;
  color: var(--profile-color);

  &:hover {
    transform: rotate(30deg);
  }
`;

export const ProfileButton = styled.button`
  border: none;
  outline: none;
  background: var(--profile-color);
  color: var(--profile-background-color);
  border-radius: 13px;
  padding: 3.14% 6%;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.34s;

  &:hover {
    transform: scale(1.055);
  }
`;

export const MediaQueryContainer = styled(ProfilePictureContainer)`
  @media (width: 987px) and (height: 610px) {
    &::after {
      content: "";
      box-shadow:
        10px -15px 10px var(--profile-color),
        -10px -15px 10px var(--profile-color),
        -10px -40px 40px var(--profile-color),
        10px -20px 40px var(--profile-color),
        -20px -50px 40px var(--profile-color);
      background-color: var(--profile-color);
      filter: blur(5px) brightness(1.1);
      position: absolute;
      border-radius: 13px;
      width: 3px;
      height: 89px;
      transform: rotate(42deg);
      left: 22px;
      bottom: 24px;
      transform-origin: bottom;
      animation: ${flashLeftLight} 0.55s;
    }

    &::before {
      content: "";
      box-shadow:
        10px -15px 10px var(--profile-color),
        -10px -15px 10px var(--profile-color),
        -10px -40px 40px var(--profile-color),
        10px -20px 40px var(--profile-color),
        20px -50px 40px var(--profile-color);
      background-color: var(--profile-color);
      filter: blur(5px) brightness(1.1);
      position: absolute;
      border-radius: 13px;
      width: 3px;
      height: 89px;
      transform: rotate(-42deg);
      right: 22px;
      bottom: 24px;
      transform-origin: bottom;
      animation: ${flashRightLight} 0.55s;
    }
  }
`;
