import { Shape } from './Shape';

export class BezierCurve extends Shape {
    public x2: number;
    public y2: number;
    public controlPoint1: { x: number; y: number };
    public controlPoint2: { x: number; y: number };
    
    constructor(
        x: number, 
        y: number, 
        x2: number, 
        y2: number, 
        lineColor: string = '#000000',
        controlPoint1?: { x: number; y: number },
        controlPoint2?: { x: number; y: number }
    ) {
        super(x, y, undefined, undefined, undefined, lineColor);
        this.x2 = x2;
        this.y2 = y2;
        // Inicializar puntos de control en la línea
        if (controlPoint1 && controlPoint2) {
            this.controlPoint1 = controlPoint1;
            this.controlPoint2 = controlPoint2;
        } else {
            this.controlPoint1 = { x: (x + x2) / 3, y: (y + y2) / 3 };
            this.controlPoint2 = { x: (x + x2) * 2 / 3, y: (y + y2) * 2 / 3 };
        }
    }

    protected drawShape(ctx: CanvasRenderingContext2D): void {
        ctx.save();  // Guardar el contexto actual
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        ctx.bezierCurveTo(
        this.controlPoint1.x, this.controlPoint1.y,
        this.controlPoint2.x, this.controlPoint2.y,
        this.x2, this.y2
        );
    
        // Aplicar color de línea y estilo
        ctx.strokeStyle = this.lineColor;
        ctx.setLineDash(this.lineStyle);  // Aplicar estilo de línea
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    
        ctx.restore();  // Restaurar el contexto original
    }

    drawCurveHandles(ctx: CanvasRenderingContext2D): void {
        const controlPoints = this.getControlPoints();
      
        controlPoints.forEach(handle => {
          ctx.fillStyle = '#00BFFF';
          ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        });
    }

    contains(x: number, y: number): boolean {
        const threshold = 5;
        const steps = 100;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const xt = Math.pow(1 - t, 3) * this.x +
                        3 * Math.pow(1 - t, 2) * t * this.controlPoint1.x +
                        3 * (1 - t) * Math.pow(t, 2) * this.controlPoint2.x +
                        Math.pow(t, 3) * this.x2;
            const yt = Math.pow(1 - t, 3) * this.y +
                        3 * Math.pow(1 - t, 2) * t * this.controlPoint1.y +
                        3 * (1 - t) * Math.pow(t, 2) * this.controlPoint2.y +
                        Math.pow(t, 3) * this.y2;

            const dx = xt - x;
            const dy = yt - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < threshold) {
                return true;
            }
        }

        return false;
    }

    // Sobreescribir el método para obtener "handles" específicos de una línea
    getResizeHandles(): { x: number, y: number }[] {
        return [
        { x: this.x, y: this.y },
        { x: this.x2, y: this.y2 },
        ];
    }

    getControlPoints(): { x: number; y: number }[] {
        return [this.controlPoint1, this.controlPoint2];
    }

    getType(): string {
        return 'curve';
    }

    // Sobreescribir el método para verificar si el mouse está sobre un "handle" de la línea
    isOverHandle(mouseX: number, mouseY: number): boolean {
        const handles = this.getResizeHandles();
        return handles.some(handle =>
        Math.abs(mouseX - handle.x) <= 5 && Math.abs(mouseY - handle.y) <= 5
        );
    }

    isOverControlPoint(mouseX: number, mouseY: number): boolean {
        const controlPoints = this.getControlPoints();
        return controlPoints.some(point =>
        Math.abs(mouseX - point.x) <= 5 && Math.abs(mouseY - point.y) <= 5
        );
    };

    translateControlPoint(controlPointIndex: number, newX: number, newY: number): void {
        if (controlPointIndex === 0) {
            this.controlPoint1.x = newX;
            this.controlPoint1.y = newY;
        } else if (controlPointIndex === 1) {
            this.controlPoint2.x = newX;
            this.controlPoint2.y = newY;
        }
    }
}