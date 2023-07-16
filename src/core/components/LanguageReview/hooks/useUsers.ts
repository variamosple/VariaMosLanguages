import { useEffect, useState } from "react";
import { ReviewUser } from "../index.types";
import axios from "axios";
import { ExternalServices } from "../index.constants";
import { Service } from "../index.structures";

export default function useUsers(): ReviewUser[] {
  const [users, setUsers] = useState<ReviewUser[]>([]);

  useEffect(() => {
    axios
      .get(
        Service(ExternalServices.UserDomain).getAll(
          ExternalServices.UsersContext
        )
      )
      .then(({ data }) => {
        setUsers(data.map((item) => ({ ...item, avatar: "" })));
      });
  }, []);

  return users;
}
