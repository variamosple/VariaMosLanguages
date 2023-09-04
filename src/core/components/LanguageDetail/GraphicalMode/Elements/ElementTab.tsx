import ElementForm from "./ElementForm";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../Utils/ItemUtils/ItemEditor/ItemEditor";
import { useState, useCallback, useEffect } from "react";
import ItemList from "../Utils/ItemUtils/ItemList/ItemList";

export default function ElementTab() {
  const { elements, setElements } = useLanguageContext();
  const defaultNewElement = {
    name: `Element ${elements.length + 1}`,
    label: "",
    draw: "",
    icon: "",
    height: "",
    width: "",
    label_property:"",
    properties: []
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
        items={elements}
        setItems={setElements}
        selectedItem={selectedElement}
        setSelectedItem={setSelectedElement}>
          <ElementForm/>
          <ItemEditor.Properties/>
          <ItemEditor.SaveButton/>
        </ItemEditor>
            
        ) : (
          <ItemList
          items={elements}
          setItems={setElements}
          defaultNewItem={defaultNewElement}
          itemLabel={"element"}
          setSelectedItem={setSelectedElement}
          />
        )}
      </div>
    );
  }