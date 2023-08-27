import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

export default function GenericFileUploadButton ({ onFileChange, fileExtensionAccepted }) {
  const inputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = event => {
    const selectedFile = event.target.files && event.target.files[0];
    setUploadedFileName(selectedFile.name)
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div>
      <input ref={inputRef} onChange={handleFileChange} type="file" className="d-none" accept={fileExtensionAccepted} />
      <Button variant="outline-secondary" className="secondary-btn input-btn btn-sm flex-grow-1" 
      onClick={handleUpload}>
        {uploadedFileName ? uploadedFileName : "Upload file"}
      </Button>
    </div>
  );
};