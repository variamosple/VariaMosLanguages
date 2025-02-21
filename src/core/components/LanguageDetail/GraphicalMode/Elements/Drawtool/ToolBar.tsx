import React, {useRef, useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { MdOutlineRectangle, MdOutlineTextFields } from "react-icons/md";
import { IoEllipseOutline, IoTriangleOutline, IoColorFill, IoColorPaletteOutline } from "react-icons/io5";
import { FaMinus, FaBezierCurve, FaUpload } from "react-icons/fa6";
import { RxBorderWidth } from "react-icons/rx";
import { PiCursorFill } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";
import { TbPolygon, TbBorderStyle2  } from "react-icons/tb";
import { AiOutlineFontSize } from "react-icons/ai";
import { SketchPicker } from 'react-color';
import CustomPatternModal from './CustomPatternModal';

interface ToolBarProps {
  selectedTool: string;
  hasSelectedShape: boolean;
  hasSelectedOverlay: boolean;
  lineWidth: number;
  lineStyle: string | number[];
  fontSize?: number;
  connectors: number;
  onSelectTool: (tool: string) => void;
  onDelete: () => void;
  onFillColorChange: (color: string) => void;
  onLineColorChange: (color: string) => void;
  onLineStyleChange: (style: string | number[]) => void;
  onLineWidthChange: (width: number) => void;
  onFontSizeChange?: (size: number) => void;
  onConnectorsChange: (connectors: number) => void;
  onFileClick: () => void;
}

export default function ToolBar({
  selectedTool,
  hasSelectedShape,
  hasSelectedOverlay,
  lineWidth,
  lineStyle,
  fontSize,
  connectors,
  onSelectTool,
  onDelete,
  onFillColorChange,
  onLineColorChange,
  onLineStyleChange,
  onLineWidthChange,
  onFontSizeChange,
  onConnectorsChange,
  onFileClick,
}: ToolBarProps) {
  const [fillColor, setFillColor] = useState<string>('#000000');
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [showFillColorPicker, setShowFillColorPicker] = useState<boolean>(false);
  const [showLineColorPicker, setShowLineColorPicker] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showFontSizeOptions, setShowFontSizeOptions] = useState(false);

  const fillColorPickerRef = useRef<HTMLDivElement | null>(null);
  const lineColorPickerRef = useRef<HTMLDivElement | null>(null);

  const handleToolClick = (tool: string) => {
    onSelectTool(tool);
  };

  const handleFillColorChange = (color: any) => {
    setFillColor(color.hex);
    onFillColorChange(color.hex);
  };

  const handleLineColorChange = (color: any) => {
    setLineColor(color.hex);
    onLineColorChange(color.hex);
  };

  const handleLineStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStyle = event.target.value;
    
    if (selectedStyle === 'custom') {
      setShowCustomModal(true);
    } else {
      onLineStyleChange(selectedStyle);
    }
  };

  const handleSaveCustomPattern = (pattern: number[]) => {
    onLineStyleChange(pattern);
    setShowCustomModal(false);
  };

  const handleLineWidthChange = (newWidth: number) => {
    if (newWidth >= 1 && newWidth <= 10) {
      onLineWidthChange(newWidth);
    }
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      onFontSizeChange?.(newSize);
    }
  };

  const handleConnectorsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const connectorsPoints = parseInt(event.target.value, 10);
    onConnectorsChange(connectorsPoints);
  };

  const toggleFillColorPicker = () => {
    setShowFillColorPicker((prevShowFillColorPicker) => {
      if (prevShowFillColorPicker) {
        return false;
      }
      setShowLineColorPicker(false);
      return true;
    });
  };

  const toggleLineColorPicker = () => {
    setShowLineColorPicker((prevShowLineColorPicker) => {
      if (prevShowLineColorPicker) {
        return false;
      }
      setShowFillColorPicker(false);
      return true;
    });
  };

  return (
    <div className="mb-3 d-flex flex-wrap gap-3">
      {/* Fila 1: Herramientas de dibujo y seleccio´n */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <ButtonGroup aria-label="Shape tools">
          <Button
            variant={selectedTool === 'select' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('select')}
          >
            <PiCursorFill />
          </Button>
          <Button
            variant={selectedTool === 'rectangle' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('rectangle')}
          >
            <MdOutlineRectangle />
          </Button>
          <Button
            variant={selectedTool === 'ellipse' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('ellipse')}
          >
            <IoEllipseOutline />
          </Button>
          <Button
            variant={selectedTool === 'triangle' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('triangle')}
          >
            <IoTriangleOutline />
          </Button>
          <Button
            variant={selectedTool === 'line' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('line')}
          >
            <FaMinus />
          </Button>
          <Button
            variant={selectedTool === 'curve' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('curve')}
          >
            <FaBezierCurve />
          </Button>
          <Button
            variant={selectedTool === 'polygon' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('polygon')}
          >
            <TbPolygon />
          </Button>
          <Button
            variant={selectedTool === 'text' ? 'primary' : 'secondary'}
            onClick={() => handleToolClick('text')}
          >
            <MdOutlineTextFields />
          </Button>
          <Button
            variant={(hasSelectedShape || hasSelectedOverlay) ? 'danger' : 'secondary'}
            onClick={onDelete}
            disabled={!hasSelectedShape && !hasSelectedOverlay}
          >
            <FaTrashAlt />
          </Button>
        </ButtonGroup>

        {/* Connectors */}
        <div className="d-flex align-items-center ms-3">
          <span>Connectors</span>
          <select
            className="form-select d-inline-block ms-2"
            style={{ width: '70px' }}
            value={connectors}
            onChange={handleConnectorsChange}
          >
            <option value="0">0</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="16">16</option>
          </select>
        </div>
      </div>

      {/* Separador */}
      <div className="w-100"></div>

      {/* Fila 2: Opciones de estilo y personalización */}
      <div className="d-flex align-items-center gap-3 flex-wrap">
        {/* Grupo de herramientas de cambio de color */}
        <ButtonGroup>
          <Button
            variant={showFillColorPicker ? 'primary' : 'secondary'}
            onClick={toggleFillColorPicker}
          >
            <IoColorFill />
          </Button>
          {showFillColorPicker && (
            <div ref={fillColorPickerRef} style={{ marginTop: '80px', position: 'absolute', zIndex: 1000 }}>
              <SketchPicker color={fillColor} onChangeComplete={handleFillColorChange} />
            </div>
          )}
          <Button
            variant={showLineColorPicker ? 'primary' : 'secondary'}
            onClick={toggleLineColorPicker}
          >
            <IoColorPaletteOutline />
          </Button>
          {showLineColorPicker && (
            <div ref={lineColorPickerRef} style={{ marginTop: '80px', position: 'absolute', zIndex: 1000 }}>
              <SketchPicker color={lineColor} onChangeComplete={handleLineColorChange} />
            </div>
          )}
        </ButtonGroup>

        {/* Herramientas de línea */}
        <div className="d-flex align-items-center">
          <TbBorderStyle2 size={24} />
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '140px' }}
              value={Array.isArray(lineStyle) ? 'custom' : lineStyle}
              onChange={handleLineStyleChange}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed (5 5)</option>
              <option value="dotted">Dotted (2 2)</option>
              <option value="longDashed">Long Dashed (10 10)</option>
              <option value="custom">Custom…</option>
            </select>
        </div>

        {/* Grosor de línea */}
        <div className="d-flex align-items-center">
          <RxBorderWidth />
          <input
            type="number"
            value={lineWidth}
            onChange={(e) => handleLineWidthChange(parseInt(e.target.value))}
            style={{ width: '50px', textAlign: 'center' }}
            className="mx-2"
          />
        </div>

        {/* Tamaño de fuente */}
        <div className="d-flex align-items-center">
          <AiOutlineFontSize />
          <div className="position-relative">
            <input
              type="text"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e)}
              onFocus={() => setShowFontSizeOptions(true)}
              onBlur={() => setTimeout(() => setShowFontSizeOptions(false), 200)}
              style={{ width: '80px', textAlign: 'center' }}
              className="form-control mx-2"
              placeholder="Font Size"
            />
            {showFontSizeOptions && (
              <ul
                className="dropdown-menu show"
                style={{
                  position: 'absolute',
                  zIndex: 1000,
                  width: '80px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {[8, 10, 12, 14, 16, 18, 24, 36, 48].map((size) => (
                  <li key={size}>
                    <button
                      className="dropdown-item"
                      onMouseDown={() =>
                        handleFontSizeChange({ target: { value: size.toString() } } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      {size}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Overlays */}
        <Button variant="secondary" onClick={onFileClick}>
          Upload Overlay 
          <FaUpload />
        </Button>
      </div>

       {/* Modal para mostrar el patrón personalizado */}
       {showCustomModal && (
        <CustomPatternModal
          show={showCustomModal}
          onSave={handleSaveCustomPattern}
          onCancel={() => setShowCustomModal(false)}
          />
        )}
    </div>
  );
  
}