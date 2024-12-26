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
import { TextElement } from './Shapes/TextElement';
import { Modal, Button, Form } from 'react-bootstrap';

interface CanvasProps {
  xml: string;
  onXmlChange: (xml: string, icon?: string) => void; // Prop para manejar los cambios en el XML
  scaleFactor: number;
  onScaleFactorChange: (scaleFactor: number) => void;
}

export default function Canvas({xml, onXmlChange, scaleFactor, onScaleFactorChange }: CanvasProps) {
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [isNewText, setIsNewText] = useState<boolean>(false);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    // Dibujar formas
    shapeCollection.shapes.forEach(shape => {
      if (shape === selectedShape) {
        ctx.save();
        shape.draw(ctx);
        if (!(shape instanceof TextElement)) {
          shape.drawResizeHandles(ctx);
        }
        ctx.restore();

      } else {
        shape.draw(ctx);
      }

      ctx.restore();
    });
  };

   // useEffect para inicializar las figuras desde el XML solo una vez
  useEffect(() => {
    if (xml && xml !== "<shape></shape>") {
      const newShapeCollection = new ShapeCollection(scaleFactor);
      newShapeCollection.fromXML(xml); // Convertir XML a formas
      setShapeCollection(newShapeCollection); // Actualizar colección de figuras
    }
  }, []);

  useEffect(() => {    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar las lineas guia
        drawGuideLines(ctx);

        drawShapes(ctx);
      }

      if (selectedTool === 'rectangle' || 
          selectedTool === 'ellipse'  || 
          selectedTool === 'triangle' ||
          selectedTool === 'polygon' ||
          selectedTool === 'line') 
      {
        canvas.style.cursor = 'crosshair';
      } else if (selectedTool === 'text') {
        canvas.style.cursor = 'text';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [shapeCollection, selectedTool, selectedShape]);

  // Dibujar las lineas guia
  const drawGuideLines = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = '#d3d3d3';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(400, 100);

    ctx.moveTo(0, 300);
    ctx.lineTo(400, 300);

    // Líneas verticales
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 400);

    ctx.moveTo(300, 0);
    ctx.lineTo(300, 400);

    ctx.stroke();
    ctx.restore();
  }
  
  // Resetear el canvas
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideLines(ctx);
    drawShapes(ctx);
  };

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool);
    updateXml();
  };

  // Función auxiliar para manejar la selección de figuras
  const handleShapeSelection = (x: number, y: number) => {
    shapeCollection.shapes.forEach(shape => shape.isSelected = false);
    for (let i = shapeCollection.shapes.length - 1; i >= 0; i--) {
      if (shapeCollection.shapes[i].contains(x, y)) {
        shapeCollection.shapes[i].isSelected = true;
        setSelectedShape(shapeCollection.shapes[i]);
        setIsDragging(true);
        setStartX(x);
        setStartY(y);
        return true; // Figuras seleccionada
      }
    }
    setSelectedShape(null);
    return false; // Ninguna figura seleccionada
  };

  // Funciones para manejar eventos del mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    if (selectedTool === 'select') {
      // Verificar si hizo clic en una figura
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
    } else if (selectedTool === 'text') {
      const newText = new TextElement(clickX, clickY);
      const updatedShapeCollection = shapeCollection;
      updatedShapeCollection.addShape(newText);

      setShapeCollection(updatedShapeCollection);
      setSelectedShape(newText);
      setIsModalOpen(true);
      setModalText(newText.content);
      setIsNewText(true);
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
        resetCanvas();
      } else{
        ShapeUtils.resizeShape(selectedShape, resizeHandleIndex, currentX, currentY);
        console.log(selectedShape, resizeHandleIndex, currentX, currentY);
        resetCanvas();
      }
      return;
    }

    if (isDrawing && startX !== null && startY !== null) {
      resetCanvas();
  
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
  
      resetCanvas();
    }

    if (selectedTool === 'polygon' && currentPolygon) {
      resetCanvas();
  
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

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (selectedTool !== 'select') return;

    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;

    // Buscar si se hizo doble clic en un texto
    for (let i = shapeCollection.shapes.length - 1; i >= 0; i--) {
      const shape = shapeCollection.shapes[i];
      if (shape instanceof TextElement && shape.contains(clickX, clickY)) {
        setSelectedShape(shape);
        setModalText(shape.content);
        setIsModalOpen(true);
        setIsNewText(false);
        break;
      }
    }
  };

  // Funciones para manejar el modal de edición de texto
  const handleTextUpdate = (content: string) => {
    if (selectedShape instanceof TextElement) {
      selectedShape.content = modalText;
      const updatedShapeCollection = shapeCollection;
      setIsModalOpen(false);
      setModalText('');
      setShapeCollection(updatedShapeCollection);

      // Cambiar a la herramienta de selección
      setSelectedShape(null);
      if (selectedTool === 'text') {
        setSelectedTool('select');
      }
      setIsNewText(false);
      
      updateXml();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalText('');
    setSelectedShape(null);

    if (selectedTool === 'text') {
      setSelectedTool('select');
    }
    setIsNewText(false);
    
    if (selectedShape instanceof TextElement && isNewText) {
      // Si se cancela la edición de un texto, eliminarlo
      handleDelete();
    }
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
          resetCanvas();
        }
      }
      updateXml();
  };

  const handleFillColorChange = (color: string) => {
    if (selectedShape) {
      selectedShape.setFillColor(color);

      resetCanvas();
    }
    updateXml();
  };
  
  const handleLineColorChange = (color: string) => {
    if (selectedShape) {
      selectedShape.setLineColor(color);
      resetCanvas();
    }
    updateXml();
  };
  
  const handleLineStyleChange = (style: string | number[]) => {
    if (selectedShape) {
      selectedShape.setLineStyle(style);
      resetCanvas();
    }
    updateXml();
  };

  const handleLineWidthChange = (width: number) => {
    if (selectedShape) {
      selectedShape.setLineWidth(width);
      resetCanvas();
    }
    updateXml();
  }

  const handleFontSizeChange = (size: number) => {
    if (selectedShape instanceof TextElement) {
      selectedShape.fontSize = size;
      resetCanvas();
    }
    updateXml();
  }

  const saveToJSON = () => {
    const json = shapeCollection.toJSON();
    console.log("Saved JSON:", json);
  };

  const updateXml = () => {
    const xml = shapeCollection.toXML();
    onScaleFactorChange(shapeCollection.getScaleFactor());
    const icon = getIcon();
    onXmlChange(xml, icon);
  };

  function getIcon() {
    const dataURL = captureRegion();

    //alert(dataURL);
    return dataURL;
  }

  const captureRegion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const area = shapeCollection.getArea();

    // Captura la región especificada
    const imageData = ctx.getImageData(area.x - 3, area.y - 3, area.width + 6, area.height + 6);

    // Crea un nuevo canvas temporal para dibujar la región capturada
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = area.width + 6;
    tempCanvas.height = area.height + 6;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);

    // Convierte el contenido del canvas temporal a una URL en base64
    const dataURL = tempCanvas.toDataURL('image/png');
    //alert("Base64 PNG de la región:" + dataURL);
    return dataURL;
  };

  return (
    <div className="container-fluid">
      {/* Usamos flexbox para organizar la toolbar y el canvas en filas */}
      <div className="d-flex flex-column">
        {/* ToolBar arriba, ocupando todo el ancho */}
        <div className="mb-2">
          <ToolBar
            selectedTool={selectedTool}
            hasSelectedShape={selectedShape !== null}
            lineWidth={selectedShape ? selectedShape.lineWidth : 1}
            lineStyle={selectedShape ? selectedShape.getLineStyle() : 'solid'}
            fontSize={selectedShape instanceof TextElement ? selectedShape.fontSize : 0}
            onSelectTool={handleSelectTool}
            onDelete={handleDelete}
            onFillColorChange={handleFillColorChange}
            onLineColorChange={handleLineColorChange}
            onLineStyleChange={handleLineStyleChange}
            onLineWidthChange={handleLineWidthChange}
            onFontSizeChange={handleFontSizeChange}
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
            onDoubleClick={handleDoubleClick}
          />
        </div>

        <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
          {selectedShape instanceof TextElement && selectedShape.content === 'Text' 
                ? 'Add Text' 
                : 'Edit Text'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleTextUpdate(modalText);
          }}>
            <Form.Group controlId="textElementContent">
              <Form.Control
                type="text"
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleTextUpdate(modalText)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );  
}