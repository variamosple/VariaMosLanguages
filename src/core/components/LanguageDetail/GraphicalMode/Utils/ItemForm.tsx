import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "../GraphicalMode.css";
import PropertyList from "./PropertyList";
import LabelList from "../Relationships/Labels/LabelList";
import StyleList from "../Relationships/Styles/StyleList";

interface FormComponentProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  properties?: any[]; 
}

interface ItemFormProps {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  handleUpdateItem: (item: any) => void;
  handleClose: () => void;
  FormComponent: React.ComponentType<FormComponentProps>;
  withProperties: boolean;
  withLabels: boolean;
  withStyles: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  selectedItem,
  setSelectedItem,
  handleUpdateItem,
  handleClose,
  FormComponent,
  withProperties,
  withLabels,
  withStyles,
}) => {
  const [formValues, setFormValues] = useState(selectedItem);
  const [properties, setProperties] = useState([]);
  const [labels, setLabels] = useState([]);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    setFormValues(selectedItem);
    setProperties(selectedItem.properties || []);
    setLabels(selectedItem.labels || []);
    setStyles(selectedItem.styles || []);
  }, [selectedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
    console.log(formValues)
  };

  const handleFormSubmit = () => {
    let updatedItem = { ...formValues };
    if (withProperties) {
      updatedItem = { ...updatedItem, properties };
    }
    if (withLabels) {
      updatedItem = { ...updatedItem, labels };
    }
    if (withStyles) {
      updatedItem = { ...updatedItem, styles };
    }
    handleUpdateItem(updatedItem);
    setSelectedItem({});
    handleClose();
  };

  return (
    <div className="square border rounded item-form">
      {formValues.name && (
        <div>
          <h5 className="center-text">{formValues.name}</h5>
          <hr></hr>
        </div>
      )}
      <FormComponent
        formValues={formValues}
        handleChange={handleChange}
        properties={properties}
      />

      {withProperties && <PropertyList properties={properties} setProperties={setProperties} />}
      {withLabels && <LabelList labels={labels} setLabels={setLabels} properties={properties} />}
      {withStyles && <StyleList styles={styles} setStyles={setStyles} properties={properties} />}
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ItemForm;
