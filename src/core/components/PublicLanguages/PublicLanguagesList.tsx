import { Paginator, PaginatorProps } from "@variamosple/variamos-components";
import { FC } from "react";
import { Alert, Table } from "react-bootstrap";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";

export interface PublicLanguagesProps extends PaginatorProps {
  languages: Language[];
  onLanguageClick: (language: Language) => void;
}

export const PublicLanguagesList: FC<PublicLanguagesProps> = ({
  languages,
  onLanguageClick,
  currentPage,
  onPageChange,
  totalPages,
}) => {
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
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((language, index) => (
            <tr
              key={index}
              className="cursor-pointer"
              onClick={() => onLanguageClick(language)}
            >
              <td>{language.name}</td>
              <td>{language.type}</td>
              <td>{language?.["ownerName"]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
