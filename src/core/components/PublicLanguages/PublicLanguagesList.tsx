import { FC } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { Language } from '../../../Domain/ProductLineEngineering/Entities/Language';
import { Paginator } from '../Paginator';

export interface PublicLanguagesProps {
  languages: Language[];
  onLanguageClick: (language: Language) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export const PublicLanguagesList: FC<PublicLanguagesProps> = ({
  languages,
  onLanguageClick,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  if (!languages?.length) {
    return <Alert variant='info'>No results available</Alert>;
  }

  const onPageChanges = (page: number) => {
    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <div className='d-flex flex-column'>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChanges}
      />
      <Table bordered hover responsive='sm'>
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
              className='cursor-pointer'
              onClick={() => onLanguageClick(language)}
            >
              <td>{language.name}</td>
              <td>{language.type}</td>
              <td>{language?.['ownerName']}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChanges}
      />
    </div>
  );
};
