import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";
import { Ellipse } from "./Shapes/Ellipse";
import { Triangle } from "./Shapes/Triangle";
import { Line } from "./Shapes/Line";
import { ShapeCollection } from './Shapes/ShapeCollection';
import { GeometryUtils } from './GeometryUtils';
import { ShapeUtils } from './Shapes/ShapeUtils';
import { Polygon } from "./Shapes/Polygon";

interface CanvasProps {
  onXmlChange: (xml: string) => void; // Prop para manejar los cambios en el XML
}

export default function Canvas({ onXmlChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [shapeCollection, setShapeCollection] = useState<ShapeCollection>(new ShapeCollection());
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandleIndex, setResizeHandleIndex] = useState<number | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<Polygon | null>(null);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    shapeCollection.shapes.forEach(shape => {

      if (shape === selectedShape) {
        ctx.save();
        shape.drawSelection(ctx);
        shape.drawResizeHandles(ctx);
        ctx.restore();

      } else {
        shape.draw(ctx);
      }

      ctx.restore();
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
          selectedTool === 'polygon' ||
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
    updateXml();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    // Función auxiliar para manejar la selección de figuras
    const handleShapeSelection = (x: number, y: number) => {
        for (let i = shapeCollection.shapes.length - 1; i >= 0; i--) {
            if (shapeCollection.shapes[i].contains(x, y)) {
                setSelectedShape(shapeCollection.shapes[i]);
                setIsDragging(true);
                setStartX(x);
                setStartY(y);
                return true; // Figuras seleccionada
            }
        }
        return false; // Ninguna figura seleccionada
    };

    if (selectedTool === 'select') {
        if (selectedShape) {
          
          if (selectedShape.isOverHandle(clickX, clickY)) {
            setIsResizing(true);
        
            if (selectedShape instanceof Polygon) {
                // Obtener el índice del vértice en el polígono
                const handleIndex = selectedShape.getResizeHandles().findIndex(handle => {
                    return (
                        clickX >= handle.x - 5 && clickX <= handle.x + 5 &&
                        clickY >= handle.y - 5 && clickY <= handle.y + 5
                    );
                });
                setResizeHandleIndex(handleIndex);
            } else {
                const handleIndex = selectedShape.getResizeHandles().findIndex(handle => {
                  return GeometryUtils.pointInRectangle(
                    clickX,
                    clickY,
                    handle.x - 5,
                    handle.y - 5,
                    10,
                    10,
                    0
                );
                });
                setResizeHandleIndex(handleIndex);
            }
            return;
          }        
        }

        // Selección de figuras
        const shapeSelected = handleShapeSelection(clickX, clickY);
        if (!shapeSelected) {
            setSelectedShape(null); // Deseleccionar figura si no se selecciona ninguna
        }

    } else if (['rectangle', 'ellipse', 'triangle', 'line'].includes(selectedTool)) {
        // Comenzar a dibujar una nueva figura
        setIsDrawing(true);
        setStartX(clickX);
        setStartY(clickY);
    } else if(selectedTool === 'polygon'){
      if (!currentPolygon) {
        setIsDrawing(true);
        setStartX(clickX);
        setStartY(clickY);
        const newPolygon = new Polygon(clickX, clickY);
        setCurrentPolygon(newPolygon); // Iniciar nuevo polígono
      } else {
        currentPolygon.addPoint(clickX, clickY);
        currentPolygon.closePolygon();
  
        // Si el usuario hace clic cerca del primer punto, cerrar el polígono
        if (currentPolygon.isClosed) {
          const updatedShapeCollection = shapeCollection;
          updatedShapeCollection.addShape(currentPolygon);
          setShapeCollection(updatedShapeCollection);
          setCurrentPolygon(null); // Terminar el dibujo
        }
      }
    }
    updateXml();
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
      if (selectedShape instanceof Polygon) {
        ShapeUtils.resizePolygon(selectedShape as Polygon, resizeHandleIndex, currentX, currentY);
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawShapes(context);
      } else{
        ShapeUtils.resizeShape(selectedShape, resizeHandleIndex, currentX, currentY);
        console.log(selectedShape, resizeHandleIndex, currentX, currentY);
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawShapes(context);
      }
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

      if (selectedShape instanceof Polygon) {
        // Traslación de polígonos
        ShapeUtils.translatePolygon(selectedShape, dx, dy);
      } else {
        // Traslación de otras figuras
        ShapeUtils.translateShape(selectedShape, dx, dy);
      }
  
      setStartX(currentX);
      setStartY(currentY);
  
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(context);
    }

    if (selectedTool === 'polygon' && currentPolygon) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(context);
  
      currentPolygon.draw(context);
  
      // Dibujar la línea dinámica entre el último punto y el cursor
      const lastPoint = currentPolygon.points[currentPolygon.points.length - 1];
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(currentX, currentY);
      context.stroke();
    }
    updateXml();
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
            newShape = new Line(startX, startY, endX, endY);
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
    updateXml();
  };

  const handleDelete = () => {
    if (selectedShape) {
      if (selectedShape) {
        const updatedShapes = shapeCollection.deleteShape(selectedShape);
        setShapeCollection(updatedShapes);
        setSelectedShape(null);
      }
    };
    

      // Redibujar el canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawShapes(context);
        }
      }
      updateXml();
  };

  const handleFillColorChange = (color: string) => {
    if (selectedShape) {
      selectedShape.setFillColor(color);

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawShapes(context);
        }
      }
    }
    updateXml();
  };
  
  const handleLineColorChange = (color: string) => {
    if (selectedShape) {
      selectedShape.setLineColor(color);
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawShapes(context);
        }
      }
    }
    updateXml();
  };
  
  const handleLineStyleChange = (style: string) => {
    if (selectedShape) {
      selectedShape.setLineStyle(style);
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawShapes(context);
        }
      }
    }
    updateXml();
  };

  const saveToJSON = () => {
    const json = shapeCollection.toJSON();
    console.log("Saved JSON:", json);
  };

  const updateXml = () => {
    const xml = shapeCollection.toXML();
    onXmlChange(xml); 
  };

  return (
    <div className="container-fluid">
      {/* Usamos flexbox para organizar la toolbar y el canvas en filas */}
      <div className="d-flex flex-column">
        {/* ToolBar arriba, ocupando todo el ancho */}
        <div className="mb-2">
          <ToolBar
            onSelectTool={handleSelectTool}
            onDelete={handleDelete}
            hasSelectedShape={selectedShape !== null}
            onFillColorChange={handleFillColorChange}
            onLineColorChange={handleLineColorChange}
            onLineStyleChange={handleLineStyleChange}
          />
        </div>

        {/* Canvas en la fila debajo del toolbar */}
        <div className="d-flex justify-content-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ border: '1px solid #000' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );  
}