export class Overlay {
    private image: HTMLImageElement | null = null;
    private isLoaded: boolean = false;
    private aspectRatio: number = 1;
    public isSelected: boolean = false;
    
    constructor(
        private src: string,
        public x: number = 100,
        public y: number = 100,
        public width: number = 50,
        public height: number = 50,
        public scale: number = 3
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

    public getResizeHandles(): { x: number, y: number }[] {
        return [
          { x: this.x, y: this.y },  // Top-left
          { x: this.x + this.width, y: this.y },  // Top-right
          { x: this.x, y: this.y + this.height },  // Bottom-left
          { x: this.x + this.width, y: this.y + this.height }  // Bottom-right
        ];
    }

    public setOverlayPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
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

    public calculateAlignment(): string {
        let alignment = '';

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        if (centerY <= 200 && centerX <= 200) {
            alignment = 'top-left';
        } else if (centerY <= 200 && centerX > 300 ) {
            alignment = 'top-right';
        } else if (centerY > 300 && centerX <= 200) {
            alignment = 'bottom-left';
        } else if (centerY > 300 && centerX > 300) {
            alignment = 'bottom-right';
        } else if (centerY > 200 && centerY <= 300 && centerX > 200 && centerX <= 300) {
            alignment = 'middle';
        } else if (centerY > 200 && centerY <= 300 && centerX > 300) {
            alignment = 'middle-right';
        } else if (centerY > 200 && centerY <= 300 && centerX <= 200) {
            alignment = 'middle-left';
        } else if (centerX > 200 && centerX <= 300 && centerY <= 200) {
            alignment = 'middle-top';
        } else if (centerX > 200 && centerX <= 300 && centerY > 300) {
            alignment = 'middle-bottom';
        }

        return alignment;
    }

    public calculateOffset(alignment: string): { offSetX: number, offSetY: number } {
        let offSetX = 0;
        let offSetY = 0;
        const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        // Coordenadas respecto al tamaño del canvas
        const LEFT: number = 100, RIGHT: number = 400, TOP: number = 100, BOTTOM: number = 400, MIDDLE: number = 250;

        switch (alignment) {
            case 'top-left':
                offSetX = center.x - LEFT;
                offSetY = center.y - TOP;
                break;
            case 'top-right':
                offSetX = center.x - RIGHT;
                offSetY = center.y - TOP;
                break;
            case 'bottom-left':
                offSetX = center.x - LEFT;
                offSetY = center.y - BOTTOM;
                break;
            case 'bottom-right':
                offSetX = center.x - RIGHT;
                offSetY = center.y - BOTTOM;
                break;
            case 'middle':
                offSetX = center.x - MIDDLE;
                offSetY = center.y - MIDDLE;
                break;
            case 'middle-right':
                offSetX = center.x - RIGHT;
                offSetY = center.y - MIDDLE;
                break;
            case 'middle-left':
                offSetX = center.x - LEFT;
                offSetY = center.y - MIDDLE;
                break;
            case 'middle-top':
                offSetX = center.x - MIDDLE;
                offSetY = center.y - TOP;
                break;
            case 'middle-bottom':
                offSetX = center.x - MIDDLE;
                offSetY = center.y - BOTTOM;
                break;
        }

        // Ajustar el offset con la escala
        offSetX /= Math.round(this.scale);
        offSetY /= Math.round(this.scale);

        return { offSetX, offSetY };
    }

    public calculateOverlayPosition(
        align: string, 
        offset_x: number, 
        offset_y: number
    ): void {
        // Referencias para las posiciones de alineación
        const LEFT = 100, RIGHT = 400, TOP = 100, BOTTOM = 400, MIDDLE = 250;
        
        // Centrar la imagen en el origen
        const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        this.x -= center.x;
        this.y -= center.y;
    
        switch (align) {
            case 'top-left':
                this.x += LEFT + (offset_x * this.scale);
                this.y += TOP + (offset_y * this.scale);
                break;
            case 'top-right':
                this.x += RIGHT + (offset_x * this.scale);
                this.y += TOP + (offset_y * this.scale);
                break;
            case 'bottom-left':
                this.x += LEFT + (offset_x * this.scale);
                this.y += BOTTOM + (offset_y * this.scale);
                break;
            case 'bottom-right':
                this.x += RIGHT + (offset_x * this.scale);
                this.y += BOTTOM + (offset_y * this.scale);
                break;
            case 'middle':
                this.x += MIDDLE + (offset_x * this.scale);
                this.y += MIDDLE + (offset_y * this.scale);
                break;
            case 'middle-right':
                this.x += RIGHT + (offset_x * this.scale);
                this.y += MIDDLE + (offset_y * this.scale);
                break;
            case 'middle-left':
                this.x += LEFT + (offset_x * this.scale);
                this.y += MIDDLE + (offset_y * this.scale);
                break;
            case 'middle-top':
                this.x += MIDDLE + (offset_x * this.scale);
                this.y += TOP + (offset_y * this.scale);
                break;
            case 'middle-bottom':
                this.x += MIDDLE + (offset_x * this.scale);
                this.y += BOTTOM + (offset_y * this.scale);
                break;
        }
    }

    // Métodos para manejar la imagen desde base64
    public static fromBase64(imageBase64: string): Promise<Overlay> {
        return new Promise((resolve, reject) => {
            const contentType = "image/png";
            const blob = Overlay.b64toBlob(imageBase64, contentType);
            const url = URL.createObjectURL(blob);
            const img = new Image();
            
            img.onload = () => {
                const overlay = new Overlay(url);
                overlay.image = img;
                overlay.isLoaded = true;
                overlay.width = img.width;
                overlay.height = img.height;
                overlay.aspectRatio = img.width / img.height;
                resolve(overlay);
            };
            
            img.onerror = (error) => {
                console.error("Error al cargar la imagen:", error, "URL:", url);
                reject(error);
            };
            
            img.src = url;
        });
    }

    private static b64toBlob(b64Data: string, contentType = "", sliceSize = 512): Blob {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    public static async toBase64(overlay: Overlay): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!overlay.image) {
                reject("No hay imagen en el overlay");
                return;
            }
    
            const canvas = document.createElement("canvas");
            canvas.width = overlay.width;
            canvas.height = overlay.height;
            
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject("No se pudo obtener el contexto del canvas");
                return;
            }
    
            // Dibujar la imagen en el canvas
            ctx.drawImage(overlay.image, 0, 0, overlay.width, overlay.height);
    
            // Convertir a Base64
            const base64String = canvas.toDataURL("image/png").split(",")[1];

            // Limpiar el canvas
            canvas.remove();
            resolve(base64String);
        });
    }

    public async toJson(): Promise<any> {
        try {
            const base64Icon = await Overlay.toBase64(this);
            const alignment = this.calculateAlignment();
            const { offSetX, offSetY } = this.calculateOffset(alignment);

            return {
                icon: base64Icon,
                align: alignment,
                offset_x: offSetX,
                offset_y: offSetY
            };
        } catch (error) {
            console.error("Error al convertir overlay a JSON:", error);
            return null;
        }
    }
}