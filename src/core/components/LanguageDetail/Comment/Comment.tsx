import { Badge, Form, InputGroup } from "react-bootstrap";
import { Comment as CurrentComment } from "../../LanguageReview/index.types";

export default function Comment({ comment }: { comment: CurrentComment }) {
  return (
    <div className="media">
      <div className="media-body">
        {/* <h5></h5> */}
        <Badge bg="secondary" className="ml-3">
          { comment.date }
        </Badge>
        <p>
          { comment.content }
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Status
          </InputGroup.Text>
          <Form.Select
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          >
            <option>Open</option>
            <option>Solved</option>
          </Form.Select>
        </InputGroup>
      </div>
    </div>
  );
}
