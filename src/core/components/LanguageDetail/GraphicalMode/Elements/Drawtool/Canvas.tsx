import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";
import { Ellipse } from "./Shapes/Ellipse";
import { Triangle } from "./Shapes/Triangle";
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

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapeCollection.shapes.forEach(shape => {

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
  }, [shapeCollection, selectedTool, selectedShape]);

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    if (selectedTool === 'select') {
      for (let i = shapeCollection.shapes.length - 1; i >= 0; i--) {
        if (shapeCollection.shapes[i].contains(clickX, clickY)) {
          setSelectedShape(shapeCollection.shapes[i]);
          setIsDragging(true);

          setStartX(clickX); 
          setStartY(clickY);

          setDragOffsetX(clickX - shapeCollection.shapes[i].x);
          setDragOffsetY(clickY - shapeCollection.shapes[i].y);
          console.log('Figure selected:', shapeCollection.shapes[i]);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const context = canvas.getContext('2d');
    if (!context) return;
  
    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;
  
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
        default:
          return;
      }
      shape.draw(context);
  
    } else if (selectedTool === 'select' && isDragging && selectedShape) {
      // Movimiento de figuras
      const dx = currentX - startX!;
      const dy = currentY - startY!;
  
      selectedShape.x += dx;
      selectedShape.y += dy;
  
      setStartX(currentX);
      setStartY(currentY);
  
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(context);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
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
