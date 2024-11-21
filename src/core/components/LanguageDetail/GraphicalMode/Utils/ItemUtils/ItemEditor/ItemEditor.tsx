import { ReactNode, useEffect, useState } from "react";
import { ItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider"
import ItemProperties from "./ItemPropreties";
import ItemSaveButton from "./ItemSaveButton";
import ItemLabels from "./ItemLabels";
import ItemStyles from "./ItemStyles";

type ItemEditorProps = {
  items: any[],
  setItems: (any) => void,
  selectedItem: any,
  setSelectedItem: (any) => void,
  children?: ReactNode
}

export default function ItemEditor({
  items,
  setItems,
  selectedItem,
  setSelectedItem,
  children }: ItemEditorProps) {

  const [formValues, setFormValues] = useState(selectedItem);
  useEffect(() => { setFormValues(selectedItem) }, [selectedItem]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "Name" || name == "name") {
      value = value.replace(/ /g, "_");
    }
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecked = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: checked, // Actualiza el valor booleano del campo
    }));
  };



  return (
    <ItemEditorContext.Provider value={{ items, setItems, selectedItem, setSelectedItem, formValues, setFormValues, handleChange, handleChecked }}>
      <div className="square border rounded item-form">
        {children}
      </div>
    </ItemEditorContext.Provider>
  )
}

ItemEditor.SaveButton = ItemSaveButton;
ItemEditor.Properties = ItemProperties;
ItemEditor.Styles = ItemStyles;
ItemEditor.Labels = ItemLabels;


