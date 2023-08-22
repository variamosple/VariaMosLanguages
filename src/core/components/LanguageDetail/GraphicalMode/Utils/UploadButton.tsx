import { Col, Button } from "react-bootstrap";

export default function UploadButton ({uploadedFileName, setUploadedFileName, setValue, inputRef, label }) {

    const handleDisplayFileDetails = async () => {
        if (inputRef.current?.files) {
          const file = inputRef.current.files[0];
          setUploadedFileName(file.name);
      
          // Read the file as a data URL (base64)
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            // Extract the base64 string without the prefix
            const base64WithoutPrefix = base64String.split(",")[1];
            setValue((prevValues) => ({
              ...prevValues,
              icon: base64WithoutPrefix, // Set the icon field with the base64 representation
            }));
          };
          reader.readAsDataURL(file);
        }
      };

      
  const handleUpload = () => {
    inputRef.current?.click();
  };

  return(
    <Col sm={4} className="d-flex align-items-stretch flex-grow-1 ">
        <input ref={inputRef} onChange={handleDisplayFileDetails} className="d-none" type="file" />
        <Button onClick={handleUpload} variant="outline-secondary" className="secondary-btn btn-sm flex-grow-1">
            {uploadedFileName ? uploadedFileName : label}
        </Button>
    </Col>
  )
}