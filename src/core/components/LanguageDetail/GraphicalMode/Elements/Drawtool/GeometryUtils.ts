export class GeometryUtils {
  static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  static pointInRectangle(px: number, py: number, x: number, y: number, width: number, height: number, angle: number): boolean {
    return px >= x && px <= x + width &&
           py >= y && py <= y + height;
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