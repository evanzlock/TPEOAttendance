import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import {
  Navbar,
  Design,
  Engineering,
  General,
  Product
} from "./components";

ReactDOM.render(
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/meeting/:meetingType" element={<General meetingType="General" />} />
      <Route path="/meeting/:meetingType" element={<Engineering meetingType="Engineering" />} />
      <Route path="/meeting/:meetingType" element={<Product meetingType="Product" />} />
      <Route path="/meeting/:meetingType" element={<Design meetingType="Design" />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);