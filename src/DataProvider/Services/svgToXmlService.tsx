import axios from 'axios';
import _config from "../../Infraestructure/config.json";

class SvgToXmlService {
  private apiUrl: string = _config.url_svg2xmlService ; // URL de l'API

  async convertSvgFileToXml(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('svgFile', file);

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      return response.data;
    } catch (error) {
      // Handle the error appropriately
      console.error('Error converting SVG to XML:', error);
      return null;
    }
  }
}

export default SvgToXmlService;
