import { Line } from "./Shapes/Line";
import { Shape } from "./Shapes/Shape";

export class GeometryUtils {
    static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    static pointInRectangle(px: number, py: number, x: number, y: number, width: number, height: number): boolean {
      return px >= x && px <= x + width && py >= y && py <= y + height;
    }
    
    static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
      return this.calculateDistance(px, py, cx, cy) <= radius;
    }

    static calculateDragOffset(clickX: number, clickY: number, shapeX: number, shapeY: number): { offsetX: number; offsetY: number } {
      return {
        offsetX: clickX - shapeX,
        offsetY: clickY - shapeY,
      };
    }

    static resizeShape(
      shape: Shape,
      resizeHandleIndex: number,
      currentX: number,
      currentY: number
    ): void {
      if (shape instanceof Line) {
        if (resizeHandleIndex === 0) {
          shape.x = currentX;
          shape.y = currentY;
        } else if (resizeHandleIndex === 1) {
          shape.x2 = currentX;
          shape.y2 = currentY;
        }
      } else {
        const { x, y, width, height } = GeometryUtils.resizeRectangle(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          resizeHandleIndex,
          currentX,
          currentY
        );
        shape.x = x;
        shape.y = y;
        shape.width = width;
        shape.height = height;
      }
    }
    
    static resizeRectangle(
      x: number,
      y: number,
      width: number,
      height: number,
      handleIndex: number,
      mouseX: number,
      mouseY: number
    ): { x: number; y: number; width: number; height: number } {
      let newX = x;
      let newY = y;
      let newWidth = width;
      let newHeight = height;
  
      switch (handleIndex) {
        case 0:  // Top-left
          newWidth += newX - mouseX;
          newHeight += newY - mouseY;
          newX = mouseX;
          newY = mouseY;
          break;
        case 1:  // Top-right
          newWidth = mouseX - newX;
          newHeight += newY - mouseY;
          newY = mouseY;
          break;
        case 2:  // Bottom-left
          newWidth += newX - mouseX;
          newHeight = mouseY - newY;
          newX = mouseX;
          break;
        case 3:  // Bottom-right
          newWidth = mouseX - newX;
          newHeight = mouseY - newY;
          break;
      }
  
      return { x: newX, y: newY, width: newWidth, height: newHeight };
    }

    static translateShape(
      shape: Shape,
      deltaX: number,
      deltaY: number
    ): void {
      if (shape instanceof Line) {
        shape.x += deltaX;
        shape.y += deltaY;
        shape.x2 += deltaX;
        shape.y2 += deltaY;
      } else {
        shape.x += deltaX;
        shape.y += deltaY;
      }
    }
  }  