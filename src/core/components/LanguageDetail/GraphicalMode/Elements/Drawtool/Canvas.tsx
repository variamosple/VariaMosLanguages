import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";
import { Ellipse } from "./Shapes/Ellipse";
import { Triangle } from "./Shapes/Triangle";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapes.forEach(shape => {

      if (shape === selectedShape) {
        ctx.save();
        shape.draw(ctx);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        ctx.restore();
      } else {
        shape.draw(ctx);
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
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
  }, [shapes, selectedTool, selectedShape]);

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    if (selectedTool === 'select') {
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].contains(clickX, clickY)) {
          setSelectedShape(shapes[i]);
          console.log('Figure selected:', shapes[i]);
          return;
        }
      }
      // Si no se selecciona ninguna figura, deselecciona la actual
      setSelectedShape(null);
    } else if (['rectangle', 'ellipse', 'triangle'].includes(selectedTool)) {
      setIsDrawing(true);
      setStartX(clickX);
      setStartY(clickY);
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
        let shape: Shape;

        switch (selectedTool) {
          case 'rectangle':
            shape = new Rectangle(startX, startY, currentX - startX, currentY - startY, '#000000');
            break;
          case 'ellipse':
            shape = new Ellipse(startX, startY, currentX - startX, currentY - startY, '#000000');
            break;
          case 'triangle':
            shape = new Triangle(startX, startY, currentX - startX, currentY - startY, '#000000');
            break;
          default:
            return;
        }
        shape.draw(context);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDrawing) {
      setIsDrawing(false);

      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;

      if (startX !== null && startY !== null) {
        let newShape: Shape;

        switch (selectedTool) {
          case 'rectangle':
            newShape = new Rectangle(startX, startY, endX - startX, endY - startY, '#000000');
            break;
          case 'ellipse':
            newShape = new Ellipse(startX, startY, endX - startX, endY - startY, '#000000');
            break;
          case 'triangle':
            newShape = new Triangle(startX, startY, endX - startX, endY - startY, '#000000');
            break;
          default:
            return;
        }
        setShapes([...shapes, newShape]);
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
