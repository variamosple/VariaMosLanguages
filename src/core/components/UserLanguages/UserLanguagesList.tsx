import { FC } from 'react';
import { Alert, Button, ButtonGroup, Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Language } from '../../../Domain/ProductLineEngineering/Entities/Language';
import { Paginator } from '../Paginator';

export interface UserLanguagesProps {
  languages: Language[];
  onLanguageClick: (language: Language) => void;
  onLanguageDelete: (language: Language) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export const UserLanguagesList: FC<UserLanguagesProps> = ({
  languages,
  onLanguageClick,
  onLanguageDelete,
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
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((language, index) => (
            <tr key={index}>
              <td
                className='cursor-pointer'
                onClick={() => onLanguageClick(language)}
              >
                {language.name}
              </td>
              <td
                className='cursor-pointer'
                onClick={() => onLanguageClick(language)}
              >
                {language.type}
              </td>
              <td className='text-center'>
                <ButtonGroup size='sm'>
                  <Button
                    variant='danger'
                    onClick={() => onLanguageDelete(language)}
                    title='Delete language'
                  >
                    <Trash />
                  </Button>
                </ButtonGroup>
              </td>
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
