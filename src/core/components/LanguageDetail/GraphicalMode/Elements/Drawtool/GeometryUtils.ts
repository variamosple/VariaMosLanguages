export class GeometryUtils {
  static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  static pointInRectangle(px: number, py: number, x: number, y: number, width: number, height: number, angle: number): boolean {
    const cx = x + width / 2;
    const cy = y + height / 2;

    // Rotar el punto alrededor del centro del rectángulo en sentido contrario al ángulo dado
    const rotatedPoint = GeometryUtils.rotatePoint(px, py, cx, cy, -angle);

    // Verificar si el punto rotado está dentro de los límites del rectángulo no rotado
    return rotatedPoint.x >= x && rotatedPoint.x <= x + width &&
           rotatedPoint.y >= y && rotatedPoint.y <= y + height;
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

  static rotatePoint(px: number, py: number, cx: number, cy: number, angle: number): { x: number, y: number } {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Trasladar punto al origen
    const dx = px - cx;
    const dy = py - cy;

    // Aplicar la rotación
    const xnew = dx * cos - dy * sin;
    const ynew = dx * sin + dy * cos;

    // Trasladar punto de regreso
    return {
      x: xnew + cx,
      y: ynew + cy
    };
  }

  static resizeBoundingBox(
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

    newWidth = Math.abs(newWidth);
    newHeight = Math.abs(newHeight);

    return { x: newX, y: newY, width: newWidth, height: newHeight };
  }

  static calculateCentroid(points: { x: number, y: number }[]): { x: number, y: number } {
    const centroid = { x: 0, y: 0 };
    points.forEach(point => {
        centroid.x += point.x;
        centroid.y += point.y;
    });
    centroid.x /= points.length;
    centroid.y /= points.length;
    return centroid;
  }

}