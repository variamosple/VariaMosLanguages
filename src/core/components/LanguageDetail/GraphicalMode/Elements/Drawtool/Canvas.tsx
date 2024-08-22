import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapes.forEach(shape => shape.draw(ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawShapes(context);
      }

      if (selectedTool === 'rectangle' || 
          selectedTool === 'ellipse'  || 
          selectedTool === 'triangle') 
      {
        canvas.style.cursor = 'crosshair';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [shapes, selectedTool]);

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'rectangle') {
      setIsDrawing(true);
      setStartX(e.nativeEvent.offsetX);
      setStartY(e.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || startX === null || startY === null) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawShapes(context);

        const currentX = e.nativeEvent.offsetX;
        const currentY = e.nativeEvent.offsetY;
        const rect = new Rectangle(startX, startY, currentX - startX, currentY - startY, '#000000');
        rect.draw(context);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDrawing) {
      setIsDrawing(false);

      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;

      if (startX !== null && startY !== null) {
        const newRect = new Rectangle(startX, startY, endX - startX, endY - startY, '#000000');
        setShapes([...shapes, newRect]);
        console.log(shapes)
      }
    }
  };

  return (
    <div>
      <ToolBar onSelectTool={handleSelectTool} />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: '1px solid #000' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
