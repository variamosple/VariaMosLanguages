import {
  usePaginatedQuery,
  withPageVisit,
} from "@variamosple/variamos-components";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { queryAllUsers, UsersFilter } from "../../../DataProvider/Services/sharedUserService";
import { User } from "../../../Domain/ProductLineEngineering/Entities/User";
import { SearchForm } from "../SearchForm";
import { UsersList } from "./UsersList";

export interface UsersContainerProps {
  languageId: number;
  onShareUser?: (userId: string, languageId: number) => Promise<void>;
}

function UsersContainerComponent({
  languageId,
  onShareUser,
}: UsersContainerProps): JSX.Element {

  const {
    data: users,
    loadData: loadUsers,
    isLoading,
    currentPage,
    onPageChange,
    totalPages,
    filter: usersFilter,
  } = usePaginatedQuery<UsersFilter, User>({
    queryFunction: queryAllUsers,
    initialFilter: new UsersFilter(languageId, undefined, undefined, 1, 10),
  });

  const onReset = () => {
    loadUsers(new UsersFilter(languageId, undefined, undefined, 1, 10));
  };

  const onSubmit = (name: string) => {
    loadUsers(
      Object.assign(new UsersFilter(languageId, undefined, undefined, 1, 10), {
        ...usersFilter,
        name,
        pageNumber: 1,
      })
    );
  };

  const handleShareUser = async (userId: string, languageId: number) => {
    if (onShareUser) {
      await onShareUser(userId, languageId);
      loadUsers(new UsersFilter(languageId, undefined, undefined, 1, 10));
    }
  };

  useEffect(() => {
    if (languageId) {
      loadUsers(new UsersFilter(languageId, undefined, undefined, 1, 10));
    }
  }, [loadUsers, languageId]);

  return (
    <div>
      <SearchForm
        isLoading={isLoading}
        onSearchReset={onReset}
        onSubmit={onSubmit}
      />

      {isLoading && (
        <div className="w-100 text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="mx-3"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!isLoading && (
        <UsersList
          users={users}
          languageId={languageId}
          onUserClick={handleShareUser}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}

    </div>
  );
};

export const UsersContainer = withPageVisit(
  UsersContainerComponent,
  "UserList"
);
