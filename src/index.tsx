import React from "react";
import ReactDOM from "react-dom";
import SignInUp from "./UI/SignUp/SignUp";
import LanguagePage from "./core/pages/LanguagesPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<SignInUp disableLogin={process.env.REACT_APP_DISABLE_LOGIN === 'true'} />} />
          <Route path="languages" element={<LanguagePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));
