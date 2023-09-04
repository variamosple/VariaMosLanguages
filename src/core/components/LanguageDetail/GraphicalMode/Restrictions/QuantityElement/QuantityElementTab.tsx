import { useCallback, useEffect, useState } from "react";
import { useLanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../../Utils/ItemUtils/ItemEditor/ItemEditor";
import ItemList from "../../Utils/ItemUtils/ItemList/ItemList";
import QuantityElementForm from "./QuantityElementForm";

export default function QuantityElementTab() {
  const { restrictions, setRestrictions } = useLanguageContext();
  const quantityElementRestrictions = restrictions.quantity_element;
  const setQuantityElementRestrictions = (newquantityElementRestrictions) => {
    setRestrictions((prev) => ({
      ...prev,
      quantity_element: newquantityElementRestrictions,
    }));
  }; 
  const defaultNewQuantityElement = {
    element: "",
    min:"",
    max:""
  };
  
    const [selectedElement, setSelectedElement] = useState({});
    const [showEditor, setShowEditor] = useState(false);
  
    const handleOpenCloseEditor = useCallback(() => {
    if (Object.keys(selectedElement).length !== 0) {
      setShowEditor(true);
    }
    else { setShowEditor(false)}
  }, [selectedElement]);
  
    useEffect(() => handleOpenCloseEditor(),[selectedElement, handleOpenCloseEditor])  
  
    return (
      <div>
        {(showEditor)? (
        <ItemEditor
        items={quantityElementRestrictions}
        setItems={setQuantityElementRestrictions}
        selectedItem={selectedElement}
        setSelectedItem={setSelectedElement}>
          <QuantityElementForm show={showEditor}/>
        </ItemEditor>
            
        ) : (
          <ItemList
          items={quantityElementRestrictions}
          setItems={setQuantityElementRestrictions}
          defaultNewItem={defaultNewQuantityElement}
          itemLabel={"quantity element"}
          setSelectedItem={setSelectedElement}
          />
        )}
      </div>
    );
  }