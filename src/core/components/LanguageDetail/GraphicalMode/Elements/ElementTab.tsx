import ElementForm from "./ElementForm";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../Utils/ItemUtils/ItemEditor/ItemEditor";
import { useState, useCallback, useEffect } from "react";
import ItemList from "../Utils/ItemUtils/ItemList/ItemList";

export default function ElementTab() {
  const { elements, setElements } = useLanguageContext();
  const defaultNewElement = {
    name: `Element ${elements.length + 1}`,
    label: `Element ${elements.length + 1}`,
    draw: "PHNoYXBlIGFzcGVjdD0idmFyaWFibGUiIHN0cm9rZXdpZHRoPSI3Ij4KCTxiYWNrZ3JvdW5kPgoJCTxzdHJva2Vjb2xvciBjb2xvcj0iIzQ0NmU3OSIvPgoJCTxmaWxsY29sb3IgY29sb3I9IiNmZmZmZmYiLz4KCQk8cGF0aD4KCQkJPG1vdmUgeD0iMCIgeT0iMCIvPgoJCQk8bGluZSB4PSIxMDAiIHk9IjAiLz4KCQkJPGxpbmUgeD0iMTAwIiB5PSIxMDAiLz4KCQkJPGxpbmUgeD0iMCIgeT0iMTAwIi8+CgkJCTxsaW5lIHg9IjAiIHk9IjAiLz4KCQkJPGNsb3NlLz4gCgkJPC9wYXRoPgkJCgk8L2JhY2tncm91bmQ+Cgk8Zm9yZWdyb3VuZD4KCQk8ZmlsbHN0cm9rZS8+Cgk8L2ZvcmVncm91bmQ+Cjwvc2hhcGU+",
    icon: "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABmSURBVGhD7ZkxDsAgAIS0//9z2xjs4BMKDJK4SW5z3i9DzIW1fAuYc64LC3v4LeBcwC7zV8536hdQAKylAFhLAbCWAmAtBcBaCoC1FABrKQDWUgCspQBYSwGwln6G1imm32EsZYwH6mkgKD+7AsEAAAAASUVORK5CYII=",
    height: "33",
    width: "100",
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