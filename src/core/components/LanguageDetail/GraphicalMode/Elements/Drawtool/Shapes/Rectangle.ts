import { Shape } from "./Shape";

export class Rectangle extends Shape {
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = this.lineColor;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getType(): string {
      return 'rectangle';
    }
  }