import React, { useRef, useEffect, useState } from 'react';
import ToolBar from './ToolBar';
import { Shape } from './Shapes/Shape';
import { Rectangle } from "./Shapes/Rectangle";
import { Ellipse } from "./Shapes/Ellipse";
import { Triangle } from "./Shapes/Triangle";
import { Line } from "./Shapes/Line";
import { BezierCurve } from './Shapes/BezierCurve';
import { ShapeCollection } from './Shapes/ShapeCollection';
import { GeometryUtils } from './GeometryUtils';
import { ShapeUtils } from './Shapes/ShapeUtils';
import { Polygon } from "./Shapes/Polygon";
import { TextElement } from './Shapes/TextElement';
import { Modal, Button, Form } from 'react-bootstrap';
import { Overlay } from './Shapes/Overlay';

interface CanvasProps {
  xml: string;
  onXmlChange: (xml: string, icon?: string, overlays?: OverlayType[]) => void; // Prop para manejar los cambios en el XML
  elementOverlays: [];
  scaleFactor: number;
  onScaleFactorChange: (scaleFactor: number) => void;
}

interface OverlayType {
  icon: string;
  align: string;
  offset_x: number;
  offset_y: number;
}

export default function Canvas({xml, onXmlChange, elementOverlays, scaleFactor, onScaleFactorChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [shapeCollection, setShapeCollection] = useState<ShapeCollection>(new ShapeCollection());
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<Overlay | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandleIndex, setResizeHandleIndex] = useState<number | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<Polygon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [isNewText, setIsNewText] = useState<boolean>(false);
  const [curveHandleIndex, setCurveHandleIndex] = useState<number | null>(null);
  const [isMovingControlPoint, setIsMovingControlPoint] = useState<boolean>(false);
  const [connectors, setConnectors] = useState<number>(0);

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    // Dibujar formas
    shapeCollection.shapes.forEach(shape => {
      if (shape === selectedShape) {
        ctx.save();
        shape.draw(ctx);
        if (!(shape instanceof TextElement)) {
          shape.drawResizeHandles(ctx);
          if (shape instanceof BezierCurve) shape.drawCurveHandles(ctx);
        }
        ctx.restore();

      } else {
        shape.draw(ctx);
      }

      // Dibujar los conectores
      drawConnectors(ctx);
      ctx.restore();
    });

    // Dibujar los overlays
    if (overlays.length > 0) {
      ctx.save();

      overlays.forEach(overlay => {
        overlay.draw(ctx);
        if (overlay.isSelected) {
          overlay.drawSelection(ctx);
        }
      });
      ctx.restore();
    }
  };

  const drawConnectors = (ctx: CanvasRenderingContext2D) => {

    const drawX = (x1: number, y1: number, x2: number, y2: number) => {
      // Color
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00a00a';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1 + 10, y1);
      ctx.lineTo(x2 - 10, y2);
      ctx.stroke();
    };

    const draw4Connectors = () => {
      drawX(245, 95, 255, 105);
      drawX(395, 245, 405, 255);
      drawX(245, 395, 255, 405);
      drawX(95, 245, 105, 255);
    };

    const draw8Connectors = () => {
      draw4Connectors();
      drawX(95, 95, 105, 105);
      drawX(395, 95, 405, 105);
      drawX(395, 395, 405, 405);
      drawX(95, 395, 105, 405);
    };

    const draw16Connectors = () => {
      draw8Connectors();
      drawX(170, 95, 180, 105);
      drawX(320, 95, 330, 105);
      drawX(320, 395, 330, 405);
      drawX(170, 395, 180, 405);
      drawX(95, 170, 105, 180);
      drawX(395, 170, 405, 180);
      drawX(395, 320, 405, 330);
      drawX(95, 320, 105, 330);
    };

    switch (connectors) {
      case 0:
        break;
      case 4:
        draw4Connectors();
        break;
      case 8:
        draw8Connectors();
        break;
      case 16:
        draw16Connectors();
        break;
    };
  };

   // useEffect para inicializar las figuras desde el XML solo una vez
  useEffect(() => {
    if (xml && xml !== "<shape></shape>") {
      const newShapeCollection = new ShapeCollection(scaleFactor);
      newShapeCollection.fromXML(xml); // Convertir XML a formas
      setShapeCollection(newShapeCollection); // Actualizar colección de figuras
      setConnectors(newShapeCollection.connectorsCount);
    }

    // Inicializar overlays
    if(elementOverlays) {
      elementOverlays.forEach((overlayData: any) => {
        if (!overlayData.icon) {
          console.warn(`Overlay missing 'icon' property for element.`);
          return;
        }
        
        // Crear overlay desde Base64
        const overlay = Overlay.fromBase64(overlayData.icon);
  
        overlay
          .then(resolvedOverlay => {
            resolvedOverlay.calculateOverlayPosition(
              overlayData.align,
              overlayData.offset_x,
              overlayData.offset_y
            );
            setOverlays((prev) => [...prev, resolvedOverlay]);
          })
          .catch(error => {
            console.error("Error creando overlay:", error);
          });
      });
    }
  }, []);

  useEffect(() => {    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#d3d3d3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawWorkSpace(ctx);
        drawShapes(ctx);
      }

      if (selectedTool === 'rectangle' || 
          selectedTool === 'ellipse'  || 
          selectedTool === 'triangle' ||
          selectedTool === 'polygon' ||
          selectedTool === 'line' ||
          selectedTool === 'curve') 
      {
        canvas.style.cursor = 'crosshair';
      } else if (selectedTool === 'text') {
        canvas.style.cursor = 'text';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  }, [shapeCollection, selectedTool, selectedShape, connectors, overlays, selectedOverlay]);

  const drawWorkSpace = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 1;

    ctx.fillRect(100, 100, 300, 300);

    ctx.restore();
  };
  
  // Resetear el canvas
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Establece el color de fondo
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawWorkSpace(ctx);
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
        // Comprobar que no haya seleccionado un overlay
        if (overlays.some(overlay => overlay.contains(x, y))) return false;
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

  // Función auxiliar para manejar la selección de overlays
  const handleOverlaySelection = (x: number, y: number) => {
    overlays.forEach(overlay => overlay.isSelected = false);
    for (let i = overlays.length - 1; i >= 0; i--) {
      if (overlays[i].contains(x, y)) {
        overlays[i].isSelected = true;
        setSelectedOverlay(overlays[i]);
        setIsDragging(true);
        setStartX(x);
        setStartY(y);
        return true; // Overlay seleccionado
      }
    }
    setSelectedOverlay(null);
    return false; // Ningún overlay seleccionado
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
        } else if ((selectedShape instanceof BezierCurve) && selectedShape.isOverControlPoint(clickX, clickY)) {
          setIsMovingControlPoint(true);
          const controlPointIndex = selectedShape.getControlPoints().findIndex(point => {
            return GeometryUtils.pointInRectangle(
              clickX,
              clickY,
              point.x - 5,
              point.y - 5,
              10,
              10,
              0
            );
          });
          setCurveHandleIndex(controlPointIndex);
          return;
        }
      } else if (selectedOverlay) {
        if (selectedOverlay.isOverHandle(clickX, clickY)) {
          setIsResizing(true);
          const handleIndex = selectedOverlay.getResizeHandles().findIndex(handle => {
            return (
              clickX >= handle.x - 5 && clickX <= handle.x + 5 &&
              clickY >= handle.y - 5 && clickY <= handle.y + 5
            );
          });
          setResizeHandleIndex(handleIndex);
          return;
        }
      }

      // Selección de figuras
      const shapeSelected = handleShapeSelection(clickX, clickY);
      if (!shapeSelected) {
          setSelectedShape(null); // Deseleccionar figura si no se selecciona ninguna
      }

      // Selección de overlays
      const overlaySelected = handleOverlaySelection(clickX, clickY);
      if (!overlaySelected) {
        setSelectedOverlay(null); // Deseleccionar overlay si no se selecciona ninguno
      }
    } else if (['rectangle', 'ellipse', 'triangle', 'line', 'curve'].includes(selectedTool)) {
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
          setSelectedTool('select');
          setSelectedShape(currentPolygon);
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
        resetCanvas();
      }
      return;
    } else if (isResizing && selectedOverlay && resizeHandleIndex !== null) {
      selectedOverlay.resize(resizeHandleIndex, currentX, currentY);
      resetCanvas();
    }

    // Si se está moviendo un punto de control de la curva de Bézier
    if (isMovingControlPoint && selectedShape instanceof BezierCurve && curveHandleIndex !== null) {
      const curve = selectedShape as BezierCurve;
      curve.translateControlPoint(curveHandleIndex, currentX, currentY);
      resetCanvas();
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
        case 'curve':
          shape = new BezierCurve(startX, startY, currentX, currentY);
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
    } else if (selectedTool === 'select' && isDragging && selectedOverlay) {
      // Movimiento de overlays
      const dx = currentX - startX!;
      const dy = currentY - startY!;

      selectedOverlay.x += dx;
      selectedOverlay.y += dy;
  
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

    if(isMovingControlPoint) {
      setIsMovingControlPoint(false);
      setCurveHandleIndex(null);
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
          case 'curve':
            newShape = new BezierCurve(startX, startY, endX, endY);
            break;
          default:
            return;
        }
        
        const updatedShapeCollection = shapeCollection;
        updatedShapeCollection.addShape(newShape);

        // Actualizar el estado con la misma instancia
        setShapeCollection(updatedShapeCollection);
        setSelectedTool('select');
        setSelectedShape(newShape);
      }
    }

    if (isDragging) {
      setIsDragging(false); // Terminar el arrastre
      setStartX(null); // Resetear coordenadas de arrastre
      setStartY(null);
      updateXml();
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
      const updatedShapes = shapeCollection.deleteShape(selectedShape);
      setShapeCollection(updatedShapes);
      setSelectedShape(null);
    };

    if (selectedOverlay) {
      const updatedOverlays = overlays.filter(overlay => overlay !== selectedOverlay);
      setOverlays(updatedOverlays);
      setSelectedOverlay(null);
    }

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

  const handleConnectorsChange = (connectors: number) => {
    setConnectors(connectors);
    shapeCollection.changeConnections(connectors);
    setSelectedTool('select');
    updateXml();
  };

  // Overlays
  // Método para activar el explorador de archivos
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // Método para manejar la selección del archivo
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const overlay = await Overlay.fromFile(file);
        setOverlays((prev) => [...prev, overlay]);
      } catch (error) {
        console.error("Error creating overlay:", error);
      }
    }
  };

  // Métodos para drop
  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Necesario para permitir el drop
    e.dataTransfer.dropEffect = "copy"; // Indica que se está copiando el archivo
  };

  const handleDrop = async (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    try {
      const overlay = await Overlay.fromDropEvent(e.nativeEvent); // Convertir a DragEvent nativo
      setOverlays((prev) => [...prev, overlay]); // Agregar al estado
    } catch (error) {
      console.error("Error creating overlay from drop:", error);
    }
  };

  const saveToJSON = () => {
    const json = shapeCollection.toJSON();
    console.log("Saved JSON:", json);
  };

  const updateXml = async () => {
    const xml = shapeCollection.toXML();
    onScaleFactorChange(shapeCollection.getScaleFactor());
    const icon = getIcon();

    try {
      const overlaysData = await Promise.all(overlays.map(overlay => overlay.toJson()));
      let json = overlaysData;
      onXmlChange(xml, icon, json);
    } catch (error) {
      console.error("Error processing overlays:", error);
    }
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
            hasSelectedOverlay={selectedOverlay !== null}
            lineWidth={selectedShape ? selectedShape.lineWidth : 1}
            lineStyle={selectedShape ? selectedShape.getLineStyle() : 'solid'}
            fontSize={selectedShape instanceof TextElement ? selectedShape.fontSize : 0}
            connectors={connectors}
            onSelectTool={handleSelectTool}
            onDelete={handleDelete}
            onFillColorChange={handleFillColorChange}
            onLineColorChange={handleLineColorChange}
            onLineStyleChange={handleLineStyleChange}
            onLineWidthChange={handleLineWidthChange}
            onFontSizeChange={handleFontSizeChange}
            onConnectorsChange={handleConnectorsChange}
            onFileClick={handleFileClick}
          />
        </div>

        {/* Input para cargar imágenes */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        
        {/* Canvas en la fila debajo del toolbar */}
        <div className="d-flex justify-content-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            style={{ border: '1px solid #000' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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