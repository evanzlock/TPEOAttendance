import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CheckinForm from './pages/CheckinForm';
import ExcusedAbsenceForm from './pages/ExcusedAbsenceForm';
import MemberTable from './pages/MemberTable';
ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/formpage/checkinForm" element={<CheckinForm />} />
      <Route path="/formpage/excusedAbsenceForm" element={<ExcusedAbsenceForm />} />
      <Route path="/formpage/memberTable" element={<MemberTable />} />
      <Route path="/formpage" element={<CheckinForm />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);