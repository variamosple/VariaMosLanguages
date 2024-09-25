import { Shape } from './Shape';

export class Polygon extends Shape{
    points: { x: number, y: number }[];  // Array de vértices del polígono
    isClosed: boolean;
    tempPoint: { x: number, y: number } | null = null;  // Punto temporal para la línea provisional

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

    protected drawShape(ctx: CanvasRenderingContext2D) {
        if (this.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
          
            // Dibuja las líneas entre los vértices ya existentes
            for (let i = 1; i < this.points.length; i++) {
              ctx.lineTo(this.points[i].x, this.points[i].y);
            }
      
            // Si hay un punto temporal (movimiento del cursor), dibuja una línea provisional
            if (this.tempPoint) {
              ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
            }
      
            // Si el polígono está cerrado, conecta con el primer punto
            if (this.isClosed) {
              ctx.lineTo(this.points[0].x, this.points[0].y);
            }
      
            ctx.strokeStyle = this.lineColor;
            ctx.stroke();
            ctx.fillStyle = this.fillColor;
            
            if (this.isClosed) {
              ctx.fill();
            }
      
            ctx.closePath();
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
                this.isClosed = true;
          }
        }
    }

    updateTempPoint(x: number, y: number) {
        this.tempPoint = { x, y };
      }
}