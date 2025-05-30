import React, { useState } from 'react';
import styled from 'styled-components';

interface GalleryProps {
  images: string[];
  width?: number;
  height?: number;
  alt?: string;
}

const GalleryWrapper = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  max-width: 100%;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
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
  transition: background-image 0.4s ease-in-out;
`;

const NavButton = styled.button<{ left?: boolean }>`
  position: absolute;
  top: 50%;
  ${({ left }) => (left ? 'left: 10px;' : 'right: 10px;')}
  transform: translateY(-50%);
  background-color: var(--current-back);
  border: none;
  border-radius: 50%;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--current-font);
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--current-back) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset 1px 1px 3px color-mix(in srgb, var(--current-back) 97.5%, #ffffff),
    inset -1px -1px 3px color-mix(in srgb, var(--current-back) 89%, #000000);
  user-select: none;
  z-index: 10;

  &:hover {
    background-color: color-mix(in srgb, var(--current-back) 80%, #000000);
    color: white;
  }

  &:focus {
    outline: 2px solid var(--current-font);
    outline-offset: 2px;
  }
`;

const Caption = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--current-font);
  background-color: color-mix(in srgb, var(--current-back) 75%, #000000);
  padding: 0.15rem 0.6rem;
  border-radius: 0.3rem;
  font-weight: 600;
  user-select: none;
  max-width: 90%;
  text-align: center;
  font-size: 0.9rem;
`;

const Gallery: React.FC<GalleryProps> = ({ images, width, height, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <GalleryWrapper width={width} height={height} aria-label={alt || 'Image gallery'}>
      <ImageContainer
        style={{ backgroundImage: `url("${images[currentIndex]}")` }}
        role="img"
        aria-label={`${alt || 'Gallery image'} ${currentIndex + 1} of ${images.length}`}
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
      {alt && <Caption>{alt}</Caption>}
    </GalleryWrapper>
  );
};

export default Gallery;
