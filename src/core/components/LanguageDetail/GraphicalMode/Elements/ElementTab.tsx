import { useContext, useState } from "react";
import ItemList from "../Utils/ItemList";
import ElementForm from "./ElementForm";
import { LanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";

export default function ElementTab() {
  const [selectedElement, setSelectedElement] = useState({});
  const { elements, setElements } = useContext(LanguageContext)
  const handleAddElement = () => {
    const newElement = {
      name: `Element ${elements.length + 1}`,
      label: "", 
      draw: "",
      icon: "",
      height: "",
      width: "",
      properties: []
    };
    setElements([...elements, newElement]);
  };

  const handleUpdateElements = (updatedElement) => {
    const index = elements.findIndex((element) => element.name === updatedElement.name);
  
    if (index !== -1) {
      const updatedElements = [...elements];
      updatedElements[index] = updatedElement;
      setElements(updatedElements);
    }
  };
  
  return (
    <div>
      <ItemList
        items={elements}
        setItems={setElements}
        onAdd={handleAddElement}
        label="element"
        selectedItem={selectedElement}
        setSelectedItem={setSelectedElement}
        renderModal={({ show, onClose }) => (
          <ElementForm 
            show={show} 
            handleClose={onClose}
            selectedElement={selectedElement}
            handleUpdateElements={handleUpdateElements}/>
        )}
      />
    </div>
  );
}
