import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: "pen" | "rectangle" | "circle" | "text" | "line";
  points?: Point[];
  startPoint?: Point;
  endPoint?: Point;
  text?: string;
  position?: Point;
  color: string;
  strokeWidth: number;
  fillColor?: string;
  fontSize?: number;
  textWidth?: number;
  textHeight?: number;
}

type WhiteboardStore = {
  elements: DrawingElement[];
  setElements: (elements: DrawingElement[]) => void;

  history: DrawingElement[][];
  setHistory: (history: DrawingElement[][]) => void;

  historyIndex: number;
  setHistoryIndex: (index: number) => void;

  color: string;
  setColor: (color: string) => void;

  fillColor: string;
  setFillColor: (fill: string) => void;

  strokeWidth: number;
  setStrokeWidth: (width: number) => void;

  fontSize: number;
  setFontSize: (size: number) => void;

  zoom: number;
  setZoom: (zoom: number) => void;
};

const useWhiteboardStore = create<WhiteboardStore>()(
  devtools(
    persist(
      (set) => ({
        elements: [],
        setElements: (elements) => set({ elements }),

        history: [[]],
        setHistory: (history) => set({ history }),

        historyIndex: 0,
        setHistoryIndex: (index) => set({ historyIndex: index }),

        color: "#000000",
        setColor: (color) => set({ color }),

        fillColor: "transparent",
        setFillColor: (fill) => set({ fillColor: fill }),

        strokeWidth: 2,
        setStrokeWidth: (width) => set({ strokeWidth: width }),

        fontSize: 16,
        setFontSize: (size) => set({ fontSize: size }),

        zoom: 1,
        setZoom: (zoom) => set({ zoom }),
      }),
      {
        name: "whiteboard-store",
      },
    ),
  ),
);

export default useWhiteboardStore;
