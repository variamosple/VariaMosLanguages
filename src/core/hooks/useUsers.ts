import { useEffect, useState } from "react";
import { ReviewUser } from "../components/LanguageReview/index.types";
import { ExternalServices } from "../components/LanguageReview/index.constants";
import { joinPath } from "../utils/PathUtils";

export default function useUsers(): ReviewUser[] {
  const [users, setUsers] = useState<ReviewUser[]>([]);

  useEffect(() => {
    const servicePath = joinPath(
      process.env.REACT_APP_URLBACKENDUSERS || ExternalServices.UserDomain,
      ExternalServices.UsersContext
    );

    const fetchData = async () => {
      try {
        const response = await fetch(servicePath);
        const data = await response.json();
        setUsers(data.map((item) => ({ ...item, avatar: "" })));
      } catch (error) {
        console.log(`Error trying to connect to the ${servicePath} service. Error ${(error)}`);
      }
    };

    fetchData();
  }, []);

  return users;
}
