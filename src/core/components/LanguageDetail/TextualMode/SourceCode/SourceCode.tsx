// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSession } from "@variamosple/variamos-components";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import { Container } from "react-bootstrap";
import Editor from "react-simple-code-editor";
import { SourceCodeProps } from "./SourceCode.types";

export default function SourceCode({ code, dispatcher }: SourceCodeProps) {
  const { user } = useSession();

  const handleCodeChange = (currentCode) => {
    const isGuest = user.roles.find((role) => role.toLowerCase() === "guest");

    if (isGuest || !user.email) {
      return;
    }

    dispatcher(currentCode);
  };

  return (
    <Container style={{ maxHeight: "800px", overflow: "auto" }}>
      <Editor
        value={code}
        onValueChange={handleCodeChange}
        highlight={(code) => highlight(code, languages.json, "json")}
        padding={10}
        className="editor"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 18,
          backgroundColor: "#1e1e1e",
          caretColor: "gray",
          color: "gray",
          borderRadius: "10px",
          overflow: "auto",
        }}
      />
    </Container>
  );
}
