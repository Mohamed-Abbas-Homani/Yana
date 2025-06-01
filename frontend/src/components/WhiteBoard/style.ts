import styled from "styled-components";

export const MainContainer = styled.div`
  --primary-color: color-mix(
    in srgb,
    var(--color) 80%,
    var(--background-color) 20%
  );
  --secondary-color: color-mix(
    in srgb,
    var(--background-color) 80%,
    var(--color) 20%
  );
  --accent-color: color-mix(
    in srgb,
    var(--color) 60%,
    var(--background-color) 40%
  );
  --light-accent: color-mix(
    in srgb,
    var(--background-color) 90%,
    var(--color) 10%
  );
  --dark-accent: color-mix(
    in srgb,
    var(--color) 90%,
    var(--background-color) 10%
  );
  --text-color: var(--color);
  --border-color: color-mix(
    in srgb,
    var(--color) 20%,
    var(--background-color) 80%
  );
  --shadow-color: color-mix(in srgb, var(--color) 10%, transparent 90%);
  --error-color: color-mix(in srgb, red 70%, var(--color) 30%);
  --success-color: color-mix(in srgb, green 70%, var(--color) 30%);

  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  color: var(--color);
`;

export const Toolbar = styled.div`
  background-color: var(--background-color);
  box-shadow: 0 4px 6px var(--shadow-color);
  padding: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid var(--border-color);
`;

export const ToolGroup = styled.div`
  height: 1.3rem;
  display: flex;
  gap: 0.25rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.3rem;
  box-shadow: inset 0 2px 4px var(--shadow-color);
`;

export const ToolButton = styled.button<{ active?: boolean }>`
  padding: 0.35rem;
  border-radius: 0.4rem;
  transition: all 0.3s ease;
  transform: ${({ active }) => (active ? "scale(1.05)" : "scale(1)")};
  background: ${({ active }) =>
    active
      ? `linear-gradient(to right, var(--primary-color), var(--accent-color))`
      : "transparent"};
  color: ${({ active }) => (active ? "white" : "var(--text-color)")};
  box-shadow: ${({ active }) =>
    active ? "0 10px 15px -3px var(--shadow-color)" : "none"};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ active }) =>
      active
        ? `linear-gradient(to right, var(--primary-color), var(--accent-color))`
        : "var(--background-color)"};
    box-shadow: ${({ active }) =>
      active
        ? "0 10px 15px -3px var(--shadow-color)"
        : "0 4px 6px -1px var(--shadow-color)"};
    transform: scale(1.05);
  }
`;

export const ColorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

export const ColorLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
`;

export const ColorPickerGroup = styled.div`
  display: flex;
  gap: 0.15rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.3rem;
`;

export const ColorButton = styled.button<{ color: string; active?: boolean }>`
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  border: 3px solid
    ${({ active }) =>
      active ? "var(--dark-accent)" : "var(--background-color)"};
  transition: all 0.3s ease;
  background-color: ${({ color }) => color};
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    border-color: var(--border-color);
  }
`;

export const ColorInput = styled.input`
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  border: 3px solid var(--background-color);
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 9999px;
    padding: 0;
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
`;

export const FillGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.475rem;
`;

export const FillLabel = styled(ColorLabel)``;

export const FillPickerGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.3rem;
`;

export const FillInput = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  border: 2px solid var(--background-color);
  cursor: pointer;
  padding: 0;

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.25rem;
    padding: 0;
  }
`;

export const TransparentButton = styled.button<{ active?: boolean }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.675rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: ${({ active }) =>
    active ? "var(--primary-color)" : "var(--background-color)"};
  color: ${({ active }) => (active ? "white" : "var(--text-color)")};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) =>
      active ? "var(--primary-color)" : "var(--light-accent)"};
  }
`;

export const WidthGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const WidthLabel = styled(ColorLabel)``;

export const WidthControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.4rem;
`;

export const WidthSlider = styled.input`
  width: 5rem;
  accent-color: var(--primary-color);
`;

export const WidthValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  width: 1.5rem;
  text-align: center;
`;

export const TextSizeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TextSizeLabel = styled(ColorLabel)``;

export const TextSizeInput = styled.input`
  width: 4rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  text-align: center;
  background-color: var(--secondary-color);
  font-size: 0.875rem;
`;

export const ZoomGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.3rem;
`;

export const ZoomButton = styled.button`
  padding: 0.3rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--background-color);
    box-shadow: 0 4px 6px -1px var(--shadow-color);
  }
`;

export const ZoomValue = styled.span`
  font-size: 0.775rem;
  padding: 0.15rem 0.55rem;
  background-color: var(--background-color);
  border-radius: 0.5rem;
  font-weight: 500;
  min-width: 4rem;
  text-align: center;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  background-color: var(--secondary-color);
  border-radius: 0.75rem;
  padding: 0.3rem;
`;

export const ActionButton = styled.button<{
  deleteBtn?: boolean;
  exportBtn?: boolean;
}>`
  padding: 0.3rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ deleteBtn, exportBtn }) =>
    deleteBtn
      ? "var(--error-color)"
      : exportBtn
        ? "var(--success-color)"
        : "inherit"};

  &:hover {
    background: var(--background-color);
    box-shadow: 0 4px 6px -1px var(--shadow-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: var(--background-color);
`;

export const Canvas = styled.canvas<{ cursorType: string }>`
  width: 100%;
  height: 100%;
  cursor: ${({ cursorType }) =>
    cursorType === "select" ? "default" : "crosshair"};
`;

export const TextInputPopup = styled.div`
  position: absolute;
  background-color: var(--background-color);
  border: 2px solid var(--primary-color);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px var(--shadow-color);
  padding: 0.5rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

export const TextInputField = styled.input`
  border: none;
  outline: none;
  background: transparent;
  min-width: 12rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: var(--text-color);

  &::placeholder {
    color: var(--text-color);
    opacity: 0.7;
  }
`;

export const TextInputActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const TextInputCancel = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--border-color);
  }
`;

export const TextInputSubmit = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background-color: var(--primary-color);
  color: var(--background-color);
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-accent);
  }
`;

export const StatusBar = styled.div`
  background-color: var(--secondary-color);
  padding: 0.2rem 1rem;
  font-size: 0.7rem;
  color: var(--text-color);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatusInfo = styled.div``;

export const StatusHighlight = styled.span`
  font-weight: 500;
`;
