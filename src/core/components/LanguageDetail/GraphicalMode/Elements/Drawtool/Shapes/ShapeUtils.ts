import { Line } from "./Line";
import type { Shape } from "./Shape";
import { Polygon } from "./Polygon"
import { GeometryUtils } from "../GeometryUtils";
import { BezierCurve } from "./BezierCurve";

export class ShapeUtils {
  static resizeShape(
    shape: Shape,
    resizeHandleIndex: number,
    currentX: number,
    currentY: number
  ): void {
    if (shape instanceof Line || shape instanceof BezierCurve) {
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
        currentY
      );

      // Asignamos los nuevos valores calculados a la figura.
      shape.x = x;
      shape.y = y;
      shape.width = width;
      shape.height = height;
    }
  }

  static resizePolygon(polygon: Polygon, handleIndex: number, newX: number, newY: number): void {
    if (handleIndex >= 0 && handleIndex < polygon.points.length) {
        
        // Calcular la diferencia de movimiento
        const deltaX = newX - polygon.points[handleIndex].x;
        const deltaY = newY - polygon.points[handleIndex].y;

        // Actualizar el vértice seleccionado basado en la diferencia de movimiento
        polygon.points[handleIndex].x += deltaX;
        polygon.points[handleIndex].y += deltaY;

        // Ajustar proporcionalmente todos los puntos del polígono
        // polygon.points.forEach((point, index) => {
        //     if (index !== handleIndex) {
        //         point.x += deltaX * (point.x - centroid.x) / (polygon.points[handleIndex].x - centroid.x);
        //         point.y += deltaY * (point.y - centroid.y) / (polygon.points[handleIndex].y - centroid.y);
        //     }
        // });
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
    } else if (shape instanceof BezierCurve) {
      shape.x += deltaX;
      shape.y += deltaY;
      shape.controlPoint1.x += deltaX;
      shape.controlPoint1.y += deltaY;
      shape.controlPoint2.x += deltaX;
      shape.controlPoint2.y += deltaY;
      shape.x2 += deltaX;
      shape.y2 += deltaY;
    } else {
      shape.x += deltaX;
      shape.y += deltaY;
    }
  }

  static translatePolygon(polygon: Polygon, deltaX: number, deltaY: number): void {
    polygon.points = polygon.points.map(point => ({
      x: point.x + deltaX,
      y: point.y + deltaY
    }));
  }
}