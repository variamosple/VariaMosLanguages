import { Shape } from './Shape';

export class TextElement extends Shape {
    content: string;
    fontSize: number;
    fontFamily: string;
    isEditing: boolean;

    constructor(
        x: number,
        y: number,
        content: string = 'Text',
        fontSize: number = 16,
        fontFamily: string = 'Arial',
        fillColor: string = '#000000',
        lineColor: string = '#00BFFF'
    ) {
        // La altura y ancho iniciales son temporales - se actualizarán en drawShape
        super(x, y, 0, 0, fillColor, lineColor);
        this.content = content;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.isEditing = false;
    }

    // Implementación del método abstracto requerido por Shape
    protected drawShape(ctx: CanvasRenderingContext2D): void {
        // Configurar estilos de texto
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        
        // Actualizar width y height basados en las métricas del texto
        const metrics = ctx.measureText(this.content);
        this.width = metrics.width;
        this.height = this.fontSize;

        // Dibujar el texto usando el fillColor de la clase base
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.content, this.x, this.y);

        // Si está seleccionado, dibujar un borde de selección
        if (this.isSelected) {
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = this.lineWidth;
            ctx.setLineDash(this.lineStyle);
            ctx.strokeRect(
                this.x - 5,
                this.y - this.height,
                this.width + 10,
                this.height + 10
            );
        }
    }

    // Sobrescribir el método contains para texto
    contains(mouseX: number, mouseY: number): boolean {
        return (
            mouseX >= this.x - 5 &&
            mouseX <= this.x + this.width + 5 &&
            mouseY >= this.y - this.height &&
            mouseY <= this.y
        );
    }

    // Sobrescribir getResizeHandles para texto
    getResizeHandles(): { x: number, y: number }[] {
        return [
            { x: this.x, y: this.y - this.height },
            { x: this.x + this.width, y: this.y - this.height },
            { x: this.x, y: this.y },
            { x: this.x + this.width, y: this.y }
        ];
    }

    // Método específico para texto
    updateContent(newContent: string): void {
        this.content = newContent;
    }

    // Sobrescribir getType
    getType(): string {
        return 'text';
    }

    // Método para actualizar el tamaño de fuente
    setFontSize(size: number): void {
        this.fontSize = size;
    }

    // Método para actualizar la familia de fuente
    setFontFamily(family: string): void {
        this.fontFamily = family;
    }
}