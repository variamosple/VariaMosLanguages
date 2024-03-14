import React from "react";
import ReactDOM from "react-dom";
import SignInUp from "./UI/SignUp/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignInUp disableLogin={process.env.REACT_APP_DISABLE_LOGIN === 'true'} />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));