import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CONSTANTS } from "../../../const";

interface MarkdownImageProps {
  src: string;
  alt?: string;
}

interface GalleryProps {
  images: string[];
  width?: number;
  height?: number;
  alt?: string;
}

/* ---------- Styled Components ---------- */

const ImageWrapper = styled.div<{ width?: number; height?: number }>`
  display: inline-block;
  max-width: 100%;
  width: ${({ width }) => (width ? `${width / 16}rem` : "auto")};
  height: ${({ height }) => (height ? `${height / 16}rem` : "auto")};
  border-radius: 0.3rem;
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--current-back) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset 1px 1px 3px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset -1px -1px 3px color-mix(in srgb, var(--current-back) 89%, #000000);
  background-color: transparent;
  user-select: none;
`;

const BackgroundDiv = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  background-image: url(${(props) => `"${props.src}"`});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    1px 1px 3px color-mix(in srgb, var(--current-back) 80%, #000000),
    -1px -1px 3px color-mix(in srgb, var(--current-back) 90%, #ffffff);
`;

const GalleryWrapper = styled.div<{ width?: number; height?: number }>`
  display: inline-block;
  position: relative;
  width: ${({ width }) => (width ? `${width / 16}rem` : "100%")};
  max-width: 100%;
  height: ${({ height }) => (height ? `${height / 16}rem` : "auto")};
  border-radius: 0.4rem;
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--current-back) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset 1px 1px 3px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset -1px -1px 3px color-mix(in srgb, var(--current-back) 89%, #000000);
  background-color: transparent;
  user-select: none;

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.3rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    1px 1px 3px color-mix(in srgb, var(--current-back) 80%, #000000),
    -1px -1px 3px color-mix(in srgb, var(--current-back) 90%, #ffffff);
  transition: background-image 0.4s ease-in-out;
`;

const NavButton = styled.button<{ left?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  ${({ left }) => (left ? "left: .625rem;" : "right: .625rem;")}
  transform: translateY(-50%);
  background-color: var(--current-back);
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  outline: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  color: var(--current-font);
  user-select: none;
  z-index: 10;
  opacity: 0.4;
  &:hover {
    opacity: 1;
  }
`;

/* ---------- Components ---------- */

const MarkdownImage: React.FC<MarkdownImageProps> = ({ src, alt = "" }) => {
  // Parse alt text for width and height options
  // Format: "alt text|width=440,height=225"
  let parsedAlt = alt;
  let width: number | undefined;
  let height: number | undefined;

  const sizeMatch = alt.match(/\|width=(\d+),?height=(\d+)/);
  if (sizeMatch) {
    width = parseInt(sizeMatch[1], 10);
    height = parseInt(sizeMatch[2], 10);
    parsedAlt = alt.replace(/\|width=\d+,?height=\d+/, "").trim();
  } else {
    const widthMatch = alt.match(/\|width=(\d+)/);
    const heightMatch = alt.match(/\|height=(\d+)/);
    if (widthMatch) {
      width = parseInt(widthMatch[1], 10);
      parsedAlt = parsedAlt.replace(/\|width=\d+/, "").trim();
    }
    if (heightMatch) {
      height = parseInt(heightMatch[1], 10);
      parsedAlt = parsedAlt.replace(/\|height=\d+/, "").trim();
    }
  }

  return (
    <ImageWrapper
      width={width ?? 367}
      height={height ?? 233}
      role="img"
      aria-label={parsedAlt}
    >
      <BackgroundDiv src={src} />
    </ImageWrapper>
  );
};

const Gallery: React.FC<GalleryProps> = ({ images, width, height, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <GalleryWrapper
      width={width}
      height={height}
      aria-label={alt || "Image gallery"}
    >
      <ImageContainer
        style={{ backgroundImage: `url("${images[currentIndex]}")` }}
        role="img"
        aria-label={`${alt || "Gallery image"} ${currentIndex + 1} of ${images.length}`}
      />
      {images.length > 1 && (
        <>
          <NavButton left onClick={prev} aria-label="Previous image">
            ‹
          </NavButton>
          <NavButton onClick={next} aria-label="Next image">
            ›
          </NavButton>
        </>
      )}
    </GalleryWrapper>
  );
};

interface MarkdownGalleryWrapperProps {
  src: string;
  alt?: string;
  noteId: string;
}

function parseSizeAndAlt(alt: string) {
  let parsedAlt = alt;
  let width: number | undefined;
  let height: number | undefined;

  const sizeMatch = alt.match(/\|width=(\d+),?height=(\d+)/);
  if (sizeMatch) {
    width = parseInt(sizeMatch[1], 10);
    height = parseInt(sizeMatch[2], 10);
    parsedAlt = alt.replace(/\|width=\d+,?height=\d+/, "").trim();
  } else {
    const widthMatch = alt.match(/\|width=(\d+)/);
    const heightMatch = alt.match(/\|height=(\d+)/);
    if (widthMatch) {
      width = parseInt(widthMatch[1], 10);
      parsedAlt = parsedAlt.replace(/\|width=\d+/, "").trim();
    }
    if (heightMatch) {
      height = parseInt(heightMatch[1], 10);
      parsedAlt = parsedAlt.replace(/\|height=\d+/, "").trim();
    }
  }

  return { parsedAlt, width, height };
}

const MarkdownImageOrGallery: React.FC<MarkdownGalleryWrapperProps> = ({
  src,
  alt = "",
  noteId,
}) => {
  const [resolvedImages, setResolvedImages] = useState<string[]>([]);

  useEffect(() => {
    const resolveSources = async () => {
      const rawSources = src
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const resolved = await Promise.all(
        rawSources.map((name) => resolveImageSrc(name, noteId)),
      );
      setResolvedImages(resolved);
    };

    resolveSources().catch((err) => {
      console.error("Failed to resolve image sources:", err);
      setResolvedImages([]); // Optional: set fallback or leave blank
    });
  }, [src, noteId]);

  const { parsedAlt, width, height } = parseSizeAndAlt(alt);

  if (resolvedImages.length === 0) return null;

  if (resolvedImages.length > 1) {
    return (
      <Gallery
        images={resolvedImages}
        width={width}
        height={height}
        alt={parsedAlt}
      />
    );
  }

  return <MarkdownImage src={resolvedImages[0]} alt={alt} />;
};

async function resolveImageSrc(name: string, noteId: string): Promise<string> {
  // Check if name looks like a URL
  try {
    new URL(name);
    return name; // Already a full URL
  } catch {
    // It's not a URL, so treat it as a document name
  }

  const response = await fetch(
    `${CONSTANTS.BackURL}/notes/${noteId}/documents/${name}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch document "${name}" for note ID "${noteId}"`,
    );
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export default MarkdownImageOrGallery;
