import React, { FC, AnchorHTMLAttributes, useState } from "react";
import styled from "styled-components";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useTranslation } from "react-i18next";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const LinkWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  padding: 0.3rem 0.5rem; // container padding (good to keep)
  background-color: transparent;
  color: var(--current-font);
  text-decoration: none;
  border-radius: 0.3rem;
  font-weight: 600;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--current-back) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset 1px 1px 3px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset -1px -1px 3px color-mix(in srgb, var(--current-back) 89%, #000000);
  transition: transform 0.2s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-0.05rem);

    .copy-icon {
      opacity: 1;
    }
  }
`;

const LinkText = styled.span`
  flex-grow: 1;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  /* Add horizontal padding so text doesn’t hug edges */
  padding-top: 0.15em;
  padding-bottom: 0.15em;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  user-select: text;

  /* Optional: add a little extra space on edges for glyph antialiasing */
  /* overflow: visible; */ /* Uncomment if needed, but test carefully */
`;

const CopyIcon = styled.span`
  opacity: 0;
  font-size: 1rem;
  transition: opacity 0.2s ease;
  user-select: none;
  flex-shrink: 0; /* prevent shrinking */
  cursor: pointer;
`;

function truncateMiddle(text: string, maxLength = 30): string {
  if (text.length <= maxLength) return text;

  const urlParts = text.match(/^(https?:\/\/[^\/]+)(.*)$/);
  if (!urlParts) {
    const front = Math.ceil(maxLength / 2);
    const back = Math.floor(maxLength / 2);
    return text.slice(0, front) + "..." + text.slice(text.length - back);
  }

  const base = urlParts[1];
  const rest = urlParts[2];

  if (base.length >= maxLength - 3) {
    return base.slice(0, maxLength - 3) + "...";
  }

  const remainLength = maxLength - base.length - 3;
  const tail = rest.slice(-remainLength);

  return base + "..." + tail;
}

const Link: FC<LinkProps> = ({ href, children, ...rest }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const handleCopy = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await writeText(href);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  // Support keyboard interaction on the copy icon
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCopy(e);
    }
  };

  const displayText =
    typeof children === "string" && children === href
      ? truncateMiddle(href)
      : children;

  return (
    <LinkWrapper href={href} rel="noopener noreferrer" {...rest} title={href}>
      <LinkText>{displayText}</LinkText>
      <CopyIcon
        className="copy-icon"
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t("Copy to clipboard")}
        title={t("Copy to clipboard")}
      >
        {copied ? "✅" : "📋"}
      </CopyIcon>
    </LinkWrapper>
  );
};

export default Link;
