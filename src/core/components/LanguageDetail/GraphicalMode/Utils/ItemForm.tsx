import React from "react";
import { Button } from "react-bootstrap";
import "../GraphicalMode.css";


interface FormComponentProps {
  selectedItem: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ItemFormProps {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  handleUpdateItem: (item: any) => void;
  handleClose: () => void;
  FormComponent: React.ComponentType<FormComponentProps>;
}

export default function ItemForm ({
  selectedItem,
  setSelectedItem,
  handleUpdateItem,
  handleClose,
  FormComponent,
}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    handleUpdateItem(selectedItem);
    setSelectedItem({});
    handleClose();
  };

  return (
    <div className="square border rounded item-form">
        <div>
          <h5 className="center-text">{selectedItem.name}</h5>
          <hr></hr>
        </div>
      <FormComponent
        selectedItem={selectedItem}
        handleChange={handleChange}
      />
           <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};

