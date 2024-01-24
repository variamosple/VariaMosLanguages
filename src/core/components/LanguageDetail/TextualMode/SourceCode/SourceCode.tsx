// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Prism from "prismjs";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import Editor from "react-simple-code-editor";
import { SourceCodeProps } from "./SourceCode.types";
import { Container } from "react-bootstrap";
import { UserTypes } from "../../../../../UI/SignUp/SignUp.constants";

export default function SourceCode({ code, dispatcher }: SourceCodeProps) {
  const handleCodeChange = (currentCode) => {
    const currentProfileString = sessionStorage.getItem("currentUserProfile")
    const currentProfile = JSON.parse(currentProfileString);

    if (currentProfile.userType === UserTypes.Guest) {
      return;
    }

    if (!currentProfile.email) {
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
          overflow: "auto"
        }}
      />
    </Container>
  );
}
