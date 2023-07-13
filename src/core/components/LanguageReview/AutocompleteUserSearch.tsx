import React, { useState } from "react";
import { Form, FormControl, ListGroup } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

export default function AutocompleteUserSearch({
  users,
  onClick,
}: {
  users: any[],
  onClick?: (event: any) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    const query = event.target.value;
    setQuery(query);

    const filteredUsers = users.filter((user) => {
      if (!query.toLowerCase()) {
        return false;
      }
      return user.name.toLowerCase().includes(query.toLowerCase());
    });

    setResults(filteredUsers);
  };

  const handleClick = (user) => () => {
    setResults([]);
    setQuery("");
    onClick(user);
  };

  return (
    <Form className="mt-3">
      <FormControl
        type="text"
        placeholder="Search for reviewers"
        value={query}
        onChange={handleChange}
      />
      <ListGroup>
        {results.map((user) => (
          <ListGroup.Item action onClick={handleClick(user)} key={user.id}>
            <PersonCircle style={{ marginRight: "10px" }} />
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Form>
  );
}
