import axios from 'axios';

class SvgToXmlService {
  private apiUrl: string = 'http://localhost:8080/api/convert'; // URL de l'API

  async convertSvgFileToXml(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('svgFile', file);

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)


      return response.data;
    } catch (error) {
      // Handle the error appropriately
      console.error('Error converting SVG to XML:', error);
      return null;
    }
  }
}

export default SvgToXmlService;
