// import {useEffect, useState } from "react";
// import ItemList from "./ItemList";
// import PropertyForm from "./PropertyForm";

// export default function PropertyList({properties, setProperties}) {
//     const [selectedProperty, setSelectedProperty] = useState({});
//     const [showPropertyForm, setShowPropertyForm] = useState(false);
    

//     useEffect(() => {
//       if(Object.keys(selectedProperty).length !== 0) {
//         setShowPropertyForm(true)
//       }
//     }, [selectedProperty])

//     const handleClose = () => {
//       setSelectedProperty({});
//       setShowPropertyForm(false);
//     }
  
//     return (
//       <div >
//         <h2 className="section-list-title">Properties</h2>
//         <hr className="form-separation" />
  
//         <ItemList
//           items={properties}
//           setItems={setProperties}
//           newItem={newProperty}
//           label={"property"}
//           setSelectedItem={setSelectedProperty}/>    

//         <PropertyForm
//           show={showPropertyForm} 
//           handleClose={handleClose}
//           selectedProperty={selectedProperty}
//           setSelectedProperty={setSelectedProperty}
//           properties={properties}
//           setProperties={setProperties}
//         />
//       </div>
//     );
//   }
  