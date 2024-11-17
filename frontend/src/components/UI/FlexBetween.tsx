import React, { ReactNode, CSSProperties } from "react";

interface FlexBetweenProps {
  children: ReactNode;
  width: string;
  height: string;
  direction?: string;
  justifyContent?: string;
  padding?: string;
  className?: string; // Optional className
  style?: CSSProperties; // Optional style prop for inline styles
}

const FlexBetween: React.FC<FlexBetweenProps> = ({
  children,
  direction,
  justifyContent,
  width,
  height,
  padding,
  className, // Optional className
  style, // Optional inline style
}) => {
  return (
    <div
      className={className} // Apply optional className
      style={{
        width,
        height,
        display: "flex",
        justifyContent: justifyContent ?? "space-between",
        alignItems: "center",
        flexDirection: direction ? "column" : "row",
        padding: padding ?? "0",
        ...style, // Merge additional styles if provided
      }}
    >
      {children}
    </div>
  );
};

export default FlexBetween;
