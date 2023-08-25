import {useEffect, useState } from "react";
import ItemList from "../../Utils/ItemList";
import StyleForm from "./StyleForm";

export default function StyleList({styles, setStyles, properties}) {
    const [selectedStyle, setSelectedStyle] = useState({});
    const [showStyleForm, setShowStyleForm] = useState(false);
    const newStyle = {
        style: "",
        linked_property:"",
        linked_value:""
      };

    useEffect(() => {
      if(Object.keys(selectedStyle).length !== 0) {
        setShowStyleForm(true)
      }
    }, [selectedStyle])

    const handleClose = () => {
        setSelectedStyle({});
        setShowStyleForm(false);
    }
  
    return (
      <div >
        <h2 className="section-list-title">Styles</h2>
        <hr className="form-separation" />
  
        <ItemList
          items={styles}
          setItems={setStyles}
          newItem={newStyle}
          label={"style"}
          setSelectedItem={setSelectedStyle}/>    

        <StyleForm
                show={showStyleForm}
                handleClose={handleClose}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                styles={styles}
                setStyles={setStyles} 
                properties={properties}/>
      </div>
    );
  }
  