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
    mouseY: number,
    angle: number // Agregar el ángulo de rotación de la figura
  ): { x: number; y: number; width: number; height: number } {
    let newX = x;
    let newY = y;
    let newWidth = width;
    let newHeight = height;

    // Convertimos las coordenadas del mouse al sistema de referencia sin rotación
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const { x: unrotatedMouseX, y: unrotatedMouseY } = GeometryUtils.rotatePoint(mouseX, mouseY, centerX, centerY, -angle);

    switch (handleIndex) {
      case 0:  // Top-left
        newWidth += newX - unrotatedMouseX;
        newHeight += newY - unrotatedMouseY;
        newX = unrotatedMouseX;
        newY = unrotatedMouseY;
        break;
      case 1:  // Top-right
        newWidth = unrotatedMouseX - newX;
        newHeight += newY - unrotatedMouseY;
        newY = unrotatedMouseY;
        break;
      case 2:  // Bottom-left
        newWidth += newX - unrotatedMouseX;
        newHeight = unrotatedMouseY - newY;
        newX = unrotatedMouseX;
        break;
      case 3:  // Bottom-right
        newWidth = unrotatedMouseX - newX;
        newHeight = unrotatedMouseY - newY;
        break;
    }

    // Convertimos de vuelta al sistema de coordenadas rotado
    const { x: rotatedX, y: rotatedY } = GeometryUtils.rotatePoint(newX, newY, centerX, centerY, angle);

    return { x: rotatedX, y: rotatedY, width: newWidth, height: newHeight };
  }
}