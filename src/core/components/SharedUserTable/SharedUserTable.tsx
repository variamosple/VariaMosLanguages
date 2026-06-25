import { Table } from "react-bootstrap";
import { User } from  "../../../Domain/ProductLineEngineering/Entities/User";
import { Trash } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

export interface SharedUserTableProps {
    // onSharedUserDelete: (userId: string, languageId: number) => void;
    onSharedUserDelete?: (userId: string) => void;
    users: User[];
    isOwner: boolean;
}

export const SharedUserTable: React.FC<SharedUserTableProps> = ({
    onSharedUserDelete = () => {},
    users = [],
    isOwner = false,
}) => {
    return (
        <>
            { (users.length == 0) && 
                (<div className="alert alert-info" role="alert">
                    That Language isn't shared.
            </div>)
            }
            { (users.length > 0) && (
            <div>
                <Table bordered hover responsive="sm" className="grey-header-table rounded">
                    <thead>
                        <tr>
                            <th>Share with</th>
                            <th>Email</th>
                            {isOwner && <th className="text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {isOwner && <td className="text-center">
                                    <Button
                                        className="btn btn-danger"
                                        onClick={() =>{onSharedUserDelete(user.id?.toString())}}
                                    >
                                        <Trash />
                                    </Button>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>)}
        </>
    );
};