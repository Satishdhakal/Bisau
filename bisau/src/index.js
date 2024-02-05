import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import SignIn from "./components/Signin";

import Main from "./Main";

import SignUp from "./components/Signup";

import { ObjectValuesProvider } from "./context/ObjectContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ObjectValuesProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} /> 
        <Route path="/main" element={<Main />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </ObjectValuesProvider>
);
reportWebVitals();
