import { FC, useState } from "react";
import { Alert, Table, Button } from "react-bootstrap";
import { Paginator, PaginatorProps } from "@variamosple/variamos-components";
import { User } from "../../../Domain/ProductLineEngineering/Entities/User";
import { Share } from "react-bootstrap-icons";


export interface UsersListProps extends PaginatorProps {
  users: User[];
  languageId: number;
  onUserClick: (userId: string, languageId: number) => Promise<void>;
}

export const UsersList: FC<UsersListProps> = ({
  users,
  languageId,
  onUserClick,
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const [sharingUserId, setSharingUserId] = useState<string | null>(null);

  if (!users?.length) {
    return <Alert variant="info">No users available</Alert>;
  }

  const handleShare = async (userId: string) => {
    setSharingUserId(userId);
    try {
      await onUserClick(userId, languageId);
    } finally {
      setSharingUserId(null);
    }
  };

  return (
    <div className="d-flex flex-column">
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <Table bordered hover responsive="sm" className="grey-header-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="text-center">
                <Button
                  variant="primary"
                  className="btn-Variamos-green"
                  onClick={() => handleShare(String(user.id))}
                  disabled={sharingUserId === String(user.id)}
                >
                  {sharingUserId === String(user.id) ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <Share />
                  )}
                </Button>
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
    </div>
  );
};