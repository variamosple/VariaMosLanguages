import React from "react";
import ReactDOM from "react-dom";
import LanguagePage from "./core/pages/LanguagesPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguagePage/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));
