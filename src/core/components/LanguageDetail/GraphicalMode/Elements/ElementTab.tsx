import ElementForm from "./ElementForm";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../Utils/ItemUtils/ItemEditor/ItemEditor";
import { useState, useCallback, useEffect } from "react";
import ItemList from "../Utils/ItemUtils/ItemList/ItemList";

export default function ElementTab() {
  const { elements, setElements } = useLanguageContext();
  const defaultNewElement = {
    name: `Element_${elements.length + 1}`,
    label: `Element ${elements.length + 1}`,
    draw: "PHNoYXBlIGFzcGVjdD0idmFyaWFibGUiIHN0cm9rZXdpZHRoPSJpbmhlcml0Ij4KICAgIDxiYWNrZ3JvdW5kPgogICAgICA8c3Ryb2tlY29sb3IgY29sb3I9IiMzMzMzMzMiLz4KICAgICAgPGZpbGxjb2xvciBjb2xvcj0iI2ZmZmZmZiIvPgogICAgICA8c3Ryb2tld2lkdGggd2lkdGg9IjMiIGZpeGVkPSIxIi8+CiAgICAgIDxwYXRoPgogICAgICAgICAgICAgIDxtb3ZlIHg9IjAiIHk9IjAiLz4KICAgICAgICAgICAgICA8bGluZSB4PSIxMDAiIHk9IjAiLz4KICAgICAgICAgICAgICA8bGluZSB4PSIxMDAiIHk9IjEwMCIvPgogICAgICAgICAgICAgIDxsaW5lIHg9IjAiIHk9IjEwMCIvPgogICAgICAgICAgICAgIDxsaW5lIHg9IjAiIHk9IjAiLz4KICAgICAgICAgICAgICA8Y2xvc2UvPiAKICAgICAgICAgIDwvcGF0aD4JIAogICAgPC9iYWNrZ3JvdW5kPgo8Zm9yZWdyb3VuZD4KICAgICAgPGZpbGxzdHJva2UvPgogICAgPC9mb3JlZ3JvdW5kPgogIDwvc2hhcGU+",
    icon: "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABmSURBVGhD7ZkxDsAgAIS0//9z2xjs4BMKDJK4SW5z3i9DzIW1fAuYc64LC3v4LeBcwC7zV8536hdQAKylAFhLAbCWAmAtBcBaCoC1FABrKQDWUgCspQBYSwGwln6G1imm32EsZYwH6mkgKD+7AsEAAAAASUVORK5CYII=",
    height: "33",
    width: "100",
    label_property:"",
    resizable:true,
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