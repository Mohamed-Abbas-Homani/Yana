import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Pen,
  Square,
  Circle,
  Type,
  Eraser,
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Minus,
  Save,
  FileText,
} from "lucide-react";
import useStore from "../../services/store";
import {
  MainContainer,
  Toolbar,
  ToolGroup,
  ToolButton,
  ColorGroup,
  ColorLabel,
  ColorPickerGroup,
  ColorButton,
  ColorInput,
  FillGroup,
  FillLabel,
  FillPickerGroup,
  FillInput,
  TransparentButton,
  WidthGroup,
  WidthLabel,
  WidthControlGroup,
  WidthSlider,
  WidthValue,
  TextSizeGroup,
  TextSizeLabel,
  TextSizeInput,
  ZoomGroup,
  ZoomButton,
  ZoomValue,
  ActionGroup,
  ActionButton,
  CanvasContainer,
  Canvas,
  TextInputPopup,
  TextInputField,
  TextInputActions,
  TextInputCancel,
  TextInputSubmit,
  StatusBar,
  StatusInfo,
  StatusHighlight,
  OpacityGroup,
  OpacityLabel,
  OpacityControlGroup,
  OpacitySlider,
  OpacityValue,
} from "./style";
import { useTranslation } from "react-i18next";
import useWhiteboardStore, {
  DrawingElement,
  Point,
} from "../../services/whiteBaordStore";
import { Copy, Triangle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Whiteboard: React.FC = () => {
  const {
    elements,
    setElements,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    color,
    setColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    fontSize,
    setFontSize,
    zoom,
    setZoom,
    opacity,
    setOpacity,
  } = useWhiteboardStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [tool, setTool] = useState<
    | "select"
    | "pen"
    | "rectangle"
    | "circle"
    | "text"
    | "eraser"
    | "line"
    | "triangle"
    | string
  >("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [panOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
  const [originalElementPosition, setOriginalElementPosition] =
    useState<any>(null);
  // UI states
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<Point>({ x: 0, y: 0 });
  const [screenTextPosition, setScreenTextPosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const { setUserAction, setLastPage } = useStore();

  useEffect(() => {
    setLastPage(location.pathname);
    setUserAction("whiteboard");
  }, []);

  const [colors, setColors] = useState([
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#FFA500",
  ]);

  const insertColor = (newColor: string) => {
    if (["#000000", "#FFFFFF"].includes(newColor)) {
      return;
    }
    setColors((prevColors) => {
      const fixed = prevColors.slice(0, 2);
      const dynamic = prevColors.slice(2);
      const filtered = dynamic.filter((color) => color !== newColor);
      const updated = [newColor, ...filtered];
      const maxDynamic = prevColors.length - 2;
      const trimmed = updated.slice(0, maxDynamic);
      return [...fixed, ...trimmed];
    });
  };

  const addToHistory = useCallback(
    (newElements: DrawingElement[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newElements]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex],
  );

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement>,
  ): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: ((e.clientX - rect.left) * scaleX - panOffset.x) / zoom,
      y: ((e.clientY - rect.top) * scaleY - panOffset.y) / zoom,
    };
  };

  const getScreenCoordinates = (canvasPoint: Point): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;

    return {
      x: (canvasPoint.x * zoom + panOffset.x) * scaleX,
      y: (canvasPoint.y * zoom + panOffset.y) * scaleY,
    };
  };

  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement,
  ) => {
    ctx.save();
    ctx.globalAlpha = element.opacity || 1;
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (element.fillColor && element.fillColor !== "transparent") {
      ctx.fillStyle = element.fillColor;
    }

    switch (element.type) {
      case "pen":
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (element.startPoint && element.endPoint) {
          const width = element.endPoint.x - element.startPoint.x;
          const height = element.endPoint.y - element.startPoint.y;

          if (element.fillColor && element.fillColor !== "transparent") {
            ctx.fillRect(
              element.startPoint.x,
              element.startPoint.y,
              width,
              height,
            );
          }
          ctx.strokeRect(
            element.startPoint.x,
            element.startPoint.y,
            width,
            height,
          );
        }
        break;

      case "circle":
        if (element.startPoint && element.endPoint) {
          const centerX = element.startPoint.x;
          const centerY = element.startPoint.y;
          const radius = Math.sqrt(
            Math.pow(element.endPoint.x - centerX, 2) +
              Math.pow(element.endPoint.y - centerY, 2),
          );
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          if (element.fillColor && element.fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case "line":
        if (element.startPoint && element.endPoint) {
          ctx.beginPath();
          ctx.moveTo(element.startPoint.x, element.startPoint.y);
          ctx.lineTo(element.endPoint.x, element.endPoint.y);
          ctx.stroke();
        }
        break;

      case "text":
        if (element.text && element.position) {
          ctx.fillStyle = element.color;
          ctx.font = `${element.fontSize || 16}px Arial`;
          ctx.fillText(element.text, element.position.x, element.position.y);
        }
        break;

      case "triangle":
        if (element.startPoint && element.endPoint) {
          ctx.beginPath();
          ctx.moveTo(element.startPoint.x, element.endPoint.y);
          ctx.lineTo(element.endPoint.x, element.endPoint.y);
          ctx.lineTo(
            (element.startPoint.x + element.endPoint.x) / 2,
            element.startPoint.y,
          );
          ctx.closePath();
          if (element.fillColor && element.fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;
    }

    // Draw selection indicator
    if (selectedElement === element.id) {
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.globalAlpha = 1;

      if (element.type === "text" && element.position) {
        const width = element.textWidth || 100;
        const height = element.textHeight || 20;
        ctx.strokeRect(
          element.position.x - 5,
          element.position.y - height - 5,
          width + 10,
          height + 10,
        );
      } else if (element.type === "pen" && element.points) {
        const bounds = getBounds(element.points);
        ctx.strokeRect(
          bounds.x - 5,
          bounds.y - 5,
          bounds.width + 10,
          bounds.height + 10,
        );
      } else if (element.startPoint && element.endPoint) {
        const minX = Math.min(element.startPoint.x, element.endPoint.x);
        const minY = Math.min(element.startPoint.y, element.endPoint.y);
        const maxX = Math.max(element.startPoint.x, element.endPoint.x);
        const maxY = Math.max(element.startPoint.y, element.endPoint.y);
        ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
      }

      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const getBounds = (points: Point[]) => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panOffset.x / zoom, panOffset.y / zoom);

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Draw current path for pen tool with opacity
    if (tool === "pen" && currentPath.length > 1) {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }, [
    elements,
    currentPath,
    tool,
    color,
    strokeWidth,
    zoom,
    panOffset,
    selectedElement,
    opacity,
  ]);

  const redrawCanvasWithPreview = useCallback(
    (previewEndPoint?: Point) => {
      redrawCanvas();

      if (
        !startPoint ||
        !previewEndPoint ||
        !["rectangle", "circle", "line", "triangle"].includes(tool)
      )
        return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(panOffset.x / zoom, panOffset.y / zoom);

      // Draw preview with dashed line and opacity
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash([8, 4]);
      ctx.globalAlpha = opacity * 0.7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (fillColor && fillColor !== "transparent") {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = opacity * 0.3;
      }

      switch (tool) {
        case "rectangle":
          const width = previewEndPoint.x - startPoint.x;
          const height = previewEndPoint.y - startPoint.y;

          if (fillColor && fillColor !== "transparent") {
            ctx.fillRect(startPoint.x, startPoint.y, width, height);
          }
          ctx.globalAlpha = opacity * 0.7;
          ctx.strokeRect(startPoint.x, startPoint.y, width, height);
          break;

        case "circle":
          const radius = Math.sqrt(
            Math.pow(previewEndPoint.x - startPoint.x, 2) +
              Math.pow(previewEndPoint.y - startPoint.y, 2),
          );
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
          if (fillColor && fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.globalAlpha = opacity * 0.7;
          ctx.stroke();
          break;

        case "line":
          ctx.globalAlpha = opacity * 0.7;
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(previewEndPoint.x, previewEndPoint.y);
          ctx.stroke();
          break;

        case "triangle":
          ctx.beginPath();
          ctx.moveTo(startPoint.x, previewEndPoint.y);
          ctx.lineTo(previewEndPoint.x, previewEndPoint.y);
          ctx.lineTo((startPoint.x + previewEndPoint.x) / 2, startPoint.y);
          ctx.closePath();
          if (fillColor && fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.globalAlpha = opacity * 0.7;
          ctx.stroke();
          break;
      }

      ctx.restore();
    },
    [
      redrawCanvas,
      startPoint,
      tool,
      color,
      strokeWidth,
      fillColor,
      zoom,
      panOffset,
      opacity,
    ],
  );

  useEffect(() => {
    setUserAction("whiteboard");
    redrawCanvas();
  }, [redrawCanvas]);

  const findElementAtPoint = (point: Point): DrawingElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.type === "text" && element.position) {
        const width = element.textWidth || 100;
        const height = element.textHeight || 20;

        if (
          point.x >= element.position.x &&
          point.x <= element.position.x + width &&
          point.y >= element.position.y - height &&
          point.y <= element.position.y
        ) {
          return element;
        }
      }
      if (element.type === "pen" && element.points) {
        const bounds = getBounds(element.points);
        if (
          point.x >= bounds.x - 5 &&
          point.x <= bounds.x + bounds.width + 5 &&
          point.y >= bounds.y - 5 &&
          point.y <= bounds.y + bounds.height + 5
        ) {
          return element;
        }
      } else if (element.startPoint && element.endPoint) {
        const minX = Math.min(element.startPoint.x, element.endPoint.x);
        const minY = Math.min(element.startPoint.y, element.endPoint.y);
        const maxX = Math.max(element.startPoint.x, element.endPoint.x);
        const maxY = Math.max(element.startPoint.y, element.endPoint.y);

        if (
          point.x >= minX - 5 &&
          point.x <= maxX + 5 &&
          point.y >= minY - 5 &&
          point.y <= maxY + 5
        ) {
          return element;
        }
      }
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);

    if (tool === "select") {
      const element = findElementAtPoint(point);
      if (element && element.id === selectedElement) {
        // Starting drag on already selected element
        setIsDragging(true);
        setDragStartPoint(point);

        // Store the original position for smooth dragging
        if (element.type === "text") {
          setOriginalElementPosition({ ...element.position });
        } else if (element.type === "pen") {
          setOriginalElementPosition(element?.points?.map((p) => ({ ...p })));
        } else {
          setOriginalElementPosition({
            startPoint: { ...element.startPoint },
            endPoint: { ...element.endPoint },
          });
        }
        return;
      }
      setSelectedElement(element?.id || null);
    }

    if (tool === "text") {
      const screenPos = getScreenCoordinates(point);
      setTextPosition(point);
      setScreenTextPosition(screenPos);
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);

    if (tool === "pen") {
      setCurrentPath([point]);
    } else if (tool === "eraser") {
      const element = findElementAtPoint(point);
      if (element) {
        const newElements = elements.filter((el) => el.id !== element.id);
        setElements(newElements);
        addToHistory(newElements);
      }
    } else {
      setStartPoint(point);
    }
  };

  const handleDragMove = useCallback(
    (point: Point) => {
      if (
        !isDragging ||
        !dragStartPoint ||
        !originalElementPosition ||
        !selectedElement
      )
        return;

      const offsetX = point.x - dragStartPoint.x;
      const offsetY = point.y - dragStartPoint.y;

      const updatedElements = elements.map((el) => {
        if (el.id !== selectedElement) return el;

        const updated = { ...el };

        // Apply offset based on element type using original position
        switch (updated.type) {
          case "text":
            updated.position = {
              x: originalElementPosition.x + offsetX,
              y: originalElementPosition.y + offsetY,
            };
            break;
          case "pen":
            updated.points = originalElementPosition.map((p: Point) => ({
              x: p.x + offsetX,
              y: p.y + offsetY,
            }));
            break;
          default: // Shapes
            updated.startPoint = {
              x: originalElementPosition.startPoint.x + offsetX,
              y: originalElementPosition.startPoint.y + offsetY,
            };
            updated.endPoint = {
              x: originalElementPosition.endPoint.x + offsetX,
              y: originalElementPosition.endPoint.y + offsetY,
            };
        }
        return updated;
      });

      setElements(updatedElements);
    },
    [
      isDragging,
      dragStartPoint,
      originalElementPosition,
      selectedElement,
      elements,
    ],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);

    if (isDragging) {
      handleDragMove(point);
      return;
    }

    if (!isDrawing) {
      // Show preview for shapes while hovering
      if (
        ["rectangle", "circle", "line", "triangle"].includes(tool) &&
        startPoint
      ) {
        redrawCanvasWithPreview(point);
      }
      return;
    }

    if (tool === "pen") {
      setCurrentPath((prev) => [...prev, point]);
    } else if (tool === "eraser") {
      const element = findElementAtPoint(point);
      if (element) {
        const newElements = elements.filter((el) => el.id !== element.id);
        setElements(newElements);
      }
    } else if (
      ["rectangle", "circle", "line", "triangle"].includes(tool) &&
      startPoint
    ) {
      redrawCanvasWithPreview(point);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartPoint(null);
      setOriginalElementPosition(null);
      addToHistory(elements);
      return;
    }

    if (!isDrawing) return;

    const point = getCanvasCoordinates(e);
    setIsDrawing(false);

    if (tool === "pen" && currentPath.length > 1) {
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: "pen",
        points: [...currentPath],
        color,
        strokeWidth,
        opacity,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setCurrentPath([]);
    } else if (
      ["rectangle", "circle", "line", "triangle"].includes(tool) &&
      startPoint
    ) {
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: tool as any,
        startPoint,
        endPoint: point,
        color,
        fillColor,
        strokeWidth,
        opacity,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setStartPoint(null);
    }
  };

  const duplicateElement = () => {
    if (!selectedElement) return;

    const element = elements.find((el) => el.id === selectedElement);
    if (!element) return;

    const duplicated = JSON.parse(JSON.stringify(element));
    duplicated.id = Date.now().toString();

    const offset = 10;
    switch (duplicated.type) {
      case "text":
        duplicated.position.x += offset;
        duplicated.position.y += offset;
        break;
      case "pen":
        duplicated.points = duplicated.points.map((p: any) => ({
          x: p.x + offset,
          y: p.y + offset,
        }));
        break;
      default:
        duplicated.startPoint.x += offset;
        duplicated.startPoint.y += offset;
        duplicated.endPoint.x += offset;
        duplicated.endPoint.y += offset;
    }

    const newElements = [...elements, duplicated];
    setElements(newElements);
    setSelectedElement(duplicated.id);
    addToHistory(newElements);
  };

  const exportPDF = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
      const imgData = await html2canvas(canvas, {
        scale: 2,
        useCORS: true,
        logging: false,
      }).then((canvas) => canvas.toDataURL("image/png"));

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("whiteboard.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
    }
  };

  const handleTextSubmit = () => {
    const text = textInputRef.current?.value.trim();
    if (text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let textWidth = 100;
      let textHeight = fontSize;

      if (ctx) {
        ctx.font = `${fontSize}px Arial`;
        textWidth = ctx.measureText(text).width;
        textHeight = fontSize;
      }

      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: "text",
        text,
        position: textPosition,
        fontSize,
        color,
        strokeWidth: 1,
        textWidth,
        textHeight,
        opacity,
      };

      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
    }
    setShowTextInput(false);
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleTextSubmit();
    } else if (e.key === "Escape") {
      setShowTextInput(false);
      if (textInputRef.current) {
        textInputRef.current.value = "";
      }
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    setZoom(newZoom);
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
    addToHistory([]);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      setSelectedElement(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      setSelectedElement(null);
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `whiteboard_at_${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    document.body.removeChild(link);
  };

  const deleteSelected = () => {
    if (selectedElement) {
      const newElements = elements.filter((el) => el.id !== selectedElement);
      setElements(newElements);
      addToHistory(newElements);
      setSelectedElement(null);
    }
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showTextInput) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "d":
            e.preventDefault();
            duplicateElement();
            break;
        }
      } else {
        switch (e.key) {
          case "Delete":
            deleteSelected();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedElement, elements, historyIndex, history, showTextInput]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [redrawCanvas]);
  return (
    <MainContainer>
      {/* Main Toolbar */}
      <Toolbar>
        {/* Tools */}
        <ToolGroup>
          {[
            { type: "select", icon: MousePointer, label: t("select") },
            { type: "pen", icon: Pen, label: t("pen") },
            { type: "rectangle", icon: Square, label: t("rectangle") },
            { type: "circle", icon: Circle, label: t("circle") },
            { type: "triangle", icon: Triangle, label: t("triangle") },
            { type: "line", icon: Minus, label: t("line") },
            { type: "text", icon: Type, label: t("text") },
            { type: "eraser", icon: Eraser, label: t("eraser") },
          ].map(({ type, icon: Icon, label }) => (
            <ToolButton
              key={type}
              onClick={() => setTool(type)}
              active={tool === type}
              title={label}
            >
              <Icon size={15} />
            </ToolButton>
          ))}
        </ToolGroup>
        <OpacityGroup>
          <OpacityLabel>{t("opacity")}:</OpacityLabel>
          <OpacityControlGroup>
            <OpacitySlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
            />
            <OpacityValue>{Math.round(opacity * 100)}%</OpacityValue>
          </OpacityControlGroup>
        </OpacityGroup>
        {/* Colors */}
        <ColorGroup>
          <ColorLabel>{t("color")}:</ColorLabel>
          <ColorPickerGroup>
            {colors.map((c) => (
              <ColorButton
                key={c}
                onClick={() => setColor(c)}
                active={color === c}
                color={c}
              />
            ))}
            <ColorInput
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                insertColor(e.target.value);
              }}
            />
          </ColorPickerGroup>
        </ColorGroup>

        {/* Fill Color for shapes */}
        {["rectangle", "circle", "triangle"].includes(tool) && (
          <FillGroup>
            <FillLabel>{t("fill")}:</FillLabel>
            <FillPickerGroup>
              <FillInput
                type="color"
                value={fillColor === "transparent" ? "#ffffff" : fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
              <TransparentButton
                onClick={() => setFillColor("transparent")}
                active={fillColor === "transparent"}
              >
                {t("none")}
              </TransparentButton>
            </FillPickerGroup>
          </FillGroup>
        )}

        {/* Stroke Width */}
        <WidthGroup>
          <WidthLabel>{t("width")}:</WidthLabel>
          <WidthControlGroup>
            <WidthSlider
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            />
            <WidthValue>{strokeWidth}</WidthValue>
          </WidthControlGroup>
        </WidthGroup>

        {/* Text Size */}
        {tool === "text" && (
          <TextSizeGroup>
            <TextSizeLabel>{t("size")}:</TextSizeLabel>
            <TextSizeInput
              type="text"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </TextSizeGroup>
        )}

        {/* Zoom Controls */}
        <ZoomGroup>
          <ZoomButton onClick={() => handleZoom(-0.1)} title={t("zoom_out")}>
            <ZoomOut size={18} />
          </ZoomButton>
          <ZoomValue>{Math.round(zoom * 100)}%</ZoomValue>
          <ZoomButton onClick={() => handleZoom(0.1)} title={t("zoom_in")}>
            <ZoomIn size={18} />
          </ZoomButton>
        </ZoomGroup>

        {/* Actions */}
        <ActionGroup>
          <ActionButton
            onClick={undo}
            disabled={historyIndex <= 0}
            title={t("undo")}
          >
            <Undo size={18} />
          </ActionButton>
          <ActionButton
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title={t("redo")}
          >
            <Redo size={18} />
          </ActionButton>
          <ActionButton
            onClick={duplicateElement}
            disabled={!selectedElement}
            title={t("duplicate")}
          >
            <Copy size={18} />
          </ActionButton>
          <ActionButton
            onClick={deleteSelected}
            disabled={!selectedElement}
            title={t("delete_selected")}
            deleteBtn
          >
            <Trash2 size={18} />
          </ActionButton>
          <ActionButton onClick={clearCanvas} title={t("clear_all")} deleteBtn>
            <Trash2 size={18} />
          </ActionButton>
          <ActionButton
            onClick={exportCanvas}
            title={t("export_as_png")}
            exportBtn
          >
            <Download size={18} />
          </ActionButton>

          <ActionButton
            onClick={exportPDF}
            title={t("export_as_pdf")}
            exportBtn
          >
            <FileText size={18} />
          </ActionButton>
          <ActionButton
            title={t("save")}
            onClick={() => {
              setUserAction("neutral");
            }}
          >
            <Save size={18} />
          </ActionButton>
        </ActionGroup>
      </Toolbar>

      {/* Canvas Container */}
      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          cursorType={tool}
        />

        {showTextInput && (
          <TextInputPopup
            style={{
              left: Math.max(
                10,
                Math.min(window.innerWidth - 260, screenTextPosition.x), // 250 + 10px margin
              ),
              top: Math.max(
                10,
                Math.min(window.innerHeight - 110, screenTextPosition.y - 40), // 100 + 10px margin
              ),
            }}
          >
            <TextInputField
              ref={textInputRef}
              type="text"
              placeholder={t("enter_text")}
              style={{ fontSize: `${fontSize}px`, color }}
              onKeyDown={handleTextKeyDown}
              autoFocus
            />
            <TextInputActions>
              <TextInputCancel onClick={() => setShowTextInput(false)}>
                {t("cancel")}
              </TextInputCancel>
              <TextInputSubmit onClick={handleTextSubmit}>
                {t("add_text")}
              </TextInputSubmit>
            </TextInputActions>
          </TextInputPopup>
        )}
      </CanvasContainer>

      {/* Status Bar */}
      <StatusBar>
        <StatusInfo>
          {t("tool")}: <StatusHighlight>{t(tool)}</StatusHighlight> |{" "}
          {t("elements")}: <StatusHighlight>{elements.length}</StatusHighlight>
          {selectedElement && (
            <>
              {" "}
              | {t("selected")}:{" "}
              <StatusHighlight>1 {t("element")}</StatusHighlight>
            </>
          )}
        </StatusInfo>
        <StatusInfo>
          {t("zoom")}:{" "}
          <StatusHighlight>{Math.round(zoom * 100)}%</StatusHighlight>
        </StatusInfo>
      </StatusBar>
    </MainContainer>
  );
};
export default Whiteboard;
