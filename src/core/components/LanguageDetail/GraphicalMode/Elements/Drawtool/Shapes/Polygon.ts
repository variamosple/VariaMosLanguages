import { Shape } from './Shape';

export class Polygon extends Shape{
  points: { x: number, y: number }[];  // Array de vértices del polígono
  isClosed: boolean;
  tempPoint: { x: number, y: number } | null = null;

  constructor(
    x: number, 
    y: number, 
    fillColor: string = "#ffffff", 
    lineColor: string = "#000000", 
    rotation: number = 0, 
    lineStyle: number[] = []
  ) {
    super(x, y, undefined, undefined, fillColor, lineColor, rotation, lineStyle);
    this.points = [{ x, y }];  // El primer punto se inicializa con las coordenadas iniciales
    this.isClosed = false;  // Inicializa el polígono como abierto
    this.tempPoint = null;
  }

  protected drawShape(ctx: CanvasRenderingContext2D): void {
    if (this.points.length > 1) {
      ctx.save();  // Guardar el contexto actual
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
  
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
  
      // Si hay un punto temporal (para el movimiento del cursor), dibuja una línea provisional
      if (this.tempPoint) {
        ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
      }
  
      // Si el polígono está cerrado, conectar con el primer punto
      if (this.isClosed) {
        ctx.lineTo(this.points[0].x, this.points[0].y);
      }
  
      // Aplicar colores de línea y relleno
      ctx.strokeStyle = this.lineColor;
      ctx.setLineDash(this.lineStyle); // Aplicar estilo de línea
      ctx.lineWidth = 2; // Asegurarse de que el grosor de la línea se establece aquí
      ctx.stroke();
  
      if (this.isClosed) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
      }
  
      ctx.restore();  // Restaurar el contexto original
    }
  }

  addPoint(x: number, y: number){
    this.points.push({ x, y });
  }

  closePolygon() {
    if (this.points.length > 2) {
      const startPoint = this.points[0];
      const endPoint = this.points[this.points.length - 1];
  
      // Si el último punto está cerca del primero, cierra el polígono
      const distance = Math.sqrt(
        Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2)
      );
  
      if (distance < 10) {  // Umbral de cierre
        this.points.pop();  // Eliminar el último punto añadido
        this.isClosed = true;
      }
    }
  }

  updateTempPoint(x: number, y: number) {
      this.tempPoint = { x, y };
  }

  contains(x: number, y: number): boolean {
    // Algoritmo de ray-casting para determinar si el punto está dentro del polígono
    let inside = false;
    for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
      const xi = this.points[i].x, yi = this.points[i].y;
      const xj = this.points[j].x, yj = this.points[j].y;
  
      const intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  drawResizeHandles(ctx: CanvasRenderingContext2D) {
    this.points.forEach(point => {  
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Handle en cada vértice
      ctx.fillStyle = '#00BFFF';
      ctx.fill();
      ctx.closePath();
    });
  }

  getResizeHandles(): { x: number, y: number }[] {
    // En polígonos, los handles son los vértices
    return this.points;
  }

  isOverHandle(mouseX: number, mouseY: number): boolean {
    // Verifica si el mouse está cerca de alguno de los vértices (handles)
    return this.points.some(point => {
        return (
            mouseX >= point.x - 5 && mouseX <= point.x + 5 &&
            mouseY >= point.y - 5 && mouseY <= point.y + 5
        );
    });
  }

  getType(): string {
    return 'polygon';
  }
    
}