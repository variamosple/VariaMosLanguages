import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

export default function GenericFileUploadButton ({ onFileChange, fileExtensionAccepted }) {
  const inputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = async () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];
      setUploadedFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div className='d-flex flex-grow-1'>
      <input ref={inputRef} onChange={handleDisplayFileDetails} type="file" className="d-none" accept={fileExtensionAccepted} />
      <Button variant="outline-secondary" className="secondary-btn input-btn btn-sm flex-grow-1" 
      onClick={handleUpload}>
        {uploadedFileName ? uploadedFileName : "Upload file"}
      </Button>
    </div>
  );
};