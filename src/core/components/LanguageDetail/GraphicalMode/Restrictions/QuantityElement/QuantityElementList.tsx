import ItemListModal from "../RestrictionList";
import QuantityElementForm from "./QuantityElementForm";

export default function QuantityElementList({ show, handleClose }) {
    return (
        <ItemListModal
          show={show}
          handleClose={handleClose}
          title="Quantity element restrictions"
          restrictionType="quantity_element"
          FormComponent={QuantityElementForm}
          newItemTemplate={{
            element: "",
            min:"",
            max:""
          }}
        />
      );
    }
