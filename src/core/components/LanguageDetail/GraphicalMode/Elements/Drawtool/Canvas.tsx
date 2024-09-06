import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";
import { Ellipse } from "./Shapes/Ellipse";
import { Triangle } from "./Shapes/Triangle";
import { Line } from "./Shapes/Line";
import { ShapeCollection } from './Shapes/ShapeCollection';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [shapeCollection, setShapeCollection] = useState<ShapeCollection>(new ShapeCollection());
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandleIndex, setResizeHandleIndex] = useState<number | null>(null);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapeCollection.shapes.forEach(shape => {

      if (shape === selectedShape) {
        ctx.save();
        shape.draw(ctx);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00BFFF';
        shape.draw(ctx);
        ctx.stroke();

        // Dibujar "handles" para redimensionar
      shape.getResizeHandles().forEach(handle => {
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
      });

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
          selectedTool === 'triangle' ||
          selectedTool === 'line') 
      {
        canvas.style.cursor = 'crosshair';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [shapeCollection, selectedTool, selectedShape]);

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    if (selectedTool === 'select') {
      if (selectedShape && selectedShape.isOverHandle(clickX, clickY)) {
        setIsResizing(true);
        // Determinar qué "handle" se está arrastrando (puede ser 0-3)
        setResizeHandleIndex(selectedShape.getResizeHandles().findIndex(handle =>
          clickX >= handle.x - 5 && clickX <= handle.x + 5 &&
          clickY >= handle.y - 5 && clickY <= handle.y + 5
        ));
        return;
      }
      for (let i = shapeCollection.shapes.length - 1; i >= 0; i--) {
        if (shapeCollection.shapes[i].contains(clickX, clickY)) {
          setSelectedShape(shapeCollection.shapes[i]);
          setIsDragging(true);

          setStartX(clickX); 
          setStartY(clickY);

          setDragOffsetX(clickX - shapeCollection.shapes[i].x);
          setDragOffsetY(clickY - shapeCollection.shapes[i].y);
          return;
        }
      }
      // Si no se selecciona ninguna figura, deselecciona la actual
      setSelectedShape(null);
    } else if (['rectangle', 'ellipse', 'triangle', 'line'].includes(selectedTool)) {
      setIsDrawing(true);
      setStartX(clickX);
      setStartY(clickY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const context = canvas.getContext('2d');
    if (!context) return;
  
    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;

     // Si se está redimensionando
  if (isResizing && selectedShape && resizeHandleIndex !== null) {
    if (selectedShape instanceof Line) {
      // Lógica específica para redimensionar una línea
      if (resizeHandleIndex === 0) {
        selectedShape.x = currentX;
        selectedShape.y = currentY;
      } else if (resizeHandleIndex === 1) {
        selectedShape.x2 = currentX;
        selectedShape.y2 = currentY;
      }
    } else {
      switch (resizeHandleIndex) {
        case 0:  // Top-left
          selectedShape.width += selectedShape.x - currentX;
          selectedShape.height += selectedShape.y - currentY;
          selectedShape.x = currentX;
          selectedShape.y = currentY;
          break;
        case 1:  // Top-right
          selectedShape.width = currentX - selectedShape.x;
          selectedShape.height += selectedShape.y - currentY;
          selectedShape.y = currentY;
          break;
        case 2:  // Bottom-left
          selectedShape.width += selectedShape.x - currentX;
          selectedShape.height = currentY - selectedShape.y;
          selectedShape.x = currentX;
          break;
        case 3:  // Bottom-right
          selectedShape.width = currentX - selectedShape.x;
          selectedShape.height = currentY - selectedShape.y;
          break;
      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawShapes(context);
    return;
  }
  
    if (isDrawing && startX !== null && startY !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(context);
  
      let shape: Shape;
  
      switch (selectedTool) {
        case 'rectangle':
          shape = new Rectangle(startX, startY, currentX - startX, currentY - startY);
          break;
        case 'ellipse':
          shape = new Ellipse(startX, startY, currentX - startX, currentY - startY);
          break;
        case 'triangle':
          shape = new Triangle(startX, startY, currentX - startX, currentY - startY);
          break;
        case 'line':
          shape = new Line(startX, startY, currentX, currentY);
          break;
        default:
          return;
      }
      shape.draw(context);
  
    } else if (selectedTool === 'select' && isDragging && selectedShape) {
      // Movimiento de figuras
      const dx = currentX - startX!;
      const dy = currentY - startY!;
  
      if (selectedShape instanceof Line) {
        selectedShape.x += dx;
        selectedShape.y += dy;
        selectedShape.x2 += dx;
        selectedShape.y2 += dy;
      } else {
        selectedShape.x += dx;
        selectedShape.y += dy;
      }
  
      setStartX(currentX);
      setStartY(currentY);
  
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(context);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {

    if (isResizing) {
      setIsResizing(false);  // Terminar el redimensionamiento
      setResizeHandleIndex(null);
      return;
    }
    
    if (isDrawing) {
      setIsDrawing(false);

      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;

      if (startX !== null && startY !== null) {
        let x = Math.min(startX, endX);
        let y = Math.min(startY, endY);
        let width = Math.abs(endX - startX);
        let height = Math.abs(endY - startY);
        let newShape: Shape;

        switch (selectedTool) {
          case 'rectangle':
            newShape = new Rectangle(x, y, width, height);
            break;
          case 'ellipse':
            newShape = new Ellipse(x, y, width, height);
            break;
          case 'triangle':
            newShape = new Triangle(x, y, width, height);
            break;
          case 'line':
            newShape = new Line(startX, startY, endX, endY); // Crear una línea final
            break;
          default:
            return;
        }
        
        const updatedShapeCollection = shapeCollection;
        updatedShapeCollection.addShape(newShape);

        // Actualizar el estado con la misma instancia
        setShapeCollection(updatedShapeCollection);
        setSelectedShape(null);
      }
    }

    if (isDragging) {
      setIsDragging(false); // Terminar el arrastre
      setStartX(null); // Resetear coordenadas de arrastre
      setStartY(null);
    }
  };

  const saveToJSON = () => {
    const json = shapeCollection.toJSON();
    console.log("Saved JSON:", json);
  };

  const saveToXML = () => {
    const xml = shapeCollection.toXML();
    console.log("Saved XML:", xml);
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
      <button onClick={saveToJSON}>Save to JSON</button>
      <button onClick={saveToXML}>Save to XML</button>
    </div>
  );
}
