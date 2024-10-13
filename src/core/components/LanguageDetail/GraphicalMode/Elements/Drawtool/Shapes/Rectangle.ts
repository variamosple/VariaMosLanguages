import { Shape } from "./Shape";

export class Rectangle extends Shape {
  protected drawShape(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

    getType(): string {
      return 'rectangle';
    }
  }