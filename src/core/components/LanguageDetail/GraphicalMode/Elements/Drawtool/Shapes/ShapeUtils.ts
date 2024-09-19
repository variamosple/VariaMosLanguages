import { Line } from "./Line";
import type { Shape } from "./Shape";
import { GeometryUtils } from "../GeometryUtils";

export class ShapeUtils {
  static resizeShape(
    shape: Shape,
    resizeHandleIndex: number,
    currentX: number,
    currentY: number
  ): void {
    if (shape instanceof Line) {
      // Si la figura es una línea, simplemente actualizamos uno de sus puntos extremos.
      if (resizeHandleIndex === 0) {
        shape.x = currentX;
        shape.y = currentY;
      } else if (resizeHandleIndex === 1) {
        shape.x2 = currentX;
        shape.y2 = currentY;
      }
    } else {

      // Calculamos el nuevo tamaño y posición de la figura después del redimensionamiento
      const { x, y, width, height } = GeometryUtils.resizeBoundingBox(
        shape.x,
        shape.y,
        shape.width,
        shape.height,
        resizeHandleIndex,
        currentX,
        currentY,
        shape.rotation || 0
      );

      // Asignamos los nuevos valores calculados a la figura.
      shape.x = x;
      shape.y = y;
      shape.width = width;
      shape.height = height;
    }
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