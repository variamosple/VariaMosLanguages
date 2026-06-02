import { useState } from "react";
import { Paginator, PaginatorProps } from "@variamosple/variamos-components";
import { FC } from "react";
import { Alert, Button, ButtonGroup, Table } from "react-bootstrap";
import { Trash, Share } from "react-bootstrap-icons";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import NoBackEndModal, { NoBackEndModalProps, NoBackEndModalDefaultProps } from "../NoBackEndModal";


export interface UserLanguagesProps extends PaginatorProps {
  languages: Language[];
  onLanguageClick: (language: Language) => void;
  onLanguageDelete: (language: Language) => void;
}


export const UserLanguagesList: FC<UserLanguagesProps> = ({
  languages,
  onLanguageClick,
  onLanguageDelete,
  currentPage,
  onPageChange,
  totalPages,
}) => {

    /*To be delete in the end */
    const [noBackEndModalState, setNoBackEndModalState] = useState<NoBackEndModalProps>({...NoBackEndModalDefaultProps});
      const NoBackEndPopUp = () => {
        setNoBackEndModalState({
          ...NoBackEndModalDefaultProps,
          show: true,
          onCancel: () => setNoBackEndModalState((currentState) => ({...currentState, show: false})),
        });
      }
    /*--------------------------*/

  if (!languages?.length) {
    return <Alert variant="info">No results available</Alert>;
  }

  return (
    <div className="d-flex flex-column">
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <Table bordered hover responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((language, index) => (
            <tr key={index}>
              <td
                className="cursor-pointer"
                onClick={() => onLanguageClick(language)}
              >
                {language.name}
              </td>
              <td
                className="cursor-pointer"
                onClick={() => onLanguageClick(language)}
              >
                {language.type}
              </td>
              <td className="text-center">
                <div className='d-flex gap-1'>
                  <Button
                    variant="danger"
                    onClick={() => onLanguageDelete(language)}
                    title="Delete language"
                  >
                    <Trash />
                  </Button>
                  <Button
                    className="btn-Variamos-green"
                    title="Share Language"
                    onClick={NoBackEndPopUp}>
                      <Share/>
                  </Button>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    {/* To be delete*/}
    <NoBackEndModal {...noBackEndModalState} />
    </div>
  );
};
