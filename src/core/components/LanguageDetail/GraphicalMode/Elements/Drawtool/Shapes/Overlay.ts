export class Overlay {
    private image: HTMLImageElement | null = null;
    private isLoaded: boolean = false;
    private aspectRatio: number = 1;
    public isSelected: boolean = false;
    
    constructor(
        private src: string,
        public x: number = 110,
        public y: number = 110,
        public width: number = 50,
        public height: number = 50
    ) {
        this.loadImage();
    }

    private loadImage(): void {
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
            this.aspectRatio = this.image!.width / this.image!.height;
            // Ajustar dimensiones iniciales manteniendo proporción
            this.adjustSizeToAspectRatio();
        };
        this.image.onerror = (error) => {
            console.error('Error loading image:', error);
            this.isLoaded = false;
        };
        this.image.src = this.src;
    }

    private adjustSizeToAspectRatio(): void {
        // Mantener el ancho y ajustar el alto según el aspect ratio
        this.height = this.width / this.aspectRatio;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isLoaded || !this.image) return;

        ctx.save();

        // Dibujar la imagen
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height );

        ctx.restore();
    }

    public drawSelection(ctx: CanvasRenderingContext2D): void {
        if (!this.isLoaded) return;

        ctx.save();

        // Dibujar el rectángulo de selección
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.drawResizeHandles(ctx);

        ctx.restore();
    }

    public drawResizeHandles(ctx: CanvasRenderingContext2D): void {
        const resizeHandles = this.getResizeHandles();
      
        resizeHandles.forEach(handle => {
          ctx.fillStyle = '#00BFFF';
          ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        });
    }

    public isOverHandle(mouseX: number, mouseY: number): boolean {
        const handles = this.getResizeHandles();
        
        return handles.some(handle => 
          mouseX >= handle.x - 5 && mouseX <= handle.x + 5 &&
          mouseY >= handle.y - 5 && mouseY <= handle.y + 5
        );
    }

    public resize(handleIndex: number, newX: number, newY: number): void {
        if (handleIndex >= 0 && handleIndex < 4) {
            switch (handleIndex) {
                case 0:  // Top-left
                    this.width += this.x - newX;
                    this.height += this.y - newY;
                    this.x = newX;
                    this.y = newY;
                    break;
                case 1:  // Top-right
                    this.width = newX - this.x;
                    this.height += this.y - newY;
                    this.y = newY;
                    break;
                case 2:  // Bottom-left
                    this.width += this.x - newX;
                    this.height = newY - this.y;
                    this.x = newX;
                    break;
                case 3:  // Bottom-right
                    this.width = newX - this.x;
                    this.height = newY - this.y;
                    break;
            }
        }
    }

    // Métodos para manejar la imagen desde input/drop
    public static fromFile(file: File): Promise<Overlay> {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File is not an image'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result as string;
                resolve(new Overlay(src));
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    public static fromDropEvent(e: DragEvent): Promise<Overlay> {
        e.preventDefault();
        const file = e.dataTransfer?.files[0];
        if (!file) {
            return Promise.reject(new Error("No file found in drop event"));
        }
        if (!file.type.startsWith("image/")) {
            return Promise.reject(new Error("File is not an image"));
        }
        return Overlay.fromFile(file);
    }

    public maintainAspectRatio(newWidth?: number, newHeight?: number): void {
        if (newWidth) {
            this.width = newWidth;
            this.height = newWidth / this.aspectRatio;
        } else if (newHeight) {
            this.height = newHeight;
            this.width = newHeight * this.aspectRatio;
        }
    }

    public getType(): string {
        return 'image';
    }

    getResizeHandles(): { x: number, y: number }[] {
        return [
          { x: this.x, y: this.y },  // Top-left
          { x: this.x + this.width, y: this.y },  // Top-right
          { x: this.x, y: this.y + this.height },  // Bottom-left
          { x: this.x + this.width, y: this.y + this.height }  // Bottom-right
        ];
    }

    public isImageLoaded(): boolean {
        return this.isLoaded;
    }

    public contains(x: number, y: number): boolean {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    public translate(deltaX: number, deltaY: number): void {
        this.x += deltaX;
        this.y += deltaY;
    }
}