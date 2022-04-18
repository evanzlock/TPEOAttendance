import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './pages/dashboard';
import TeamPage from './pages/teamPage';
ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/app" element={<Dashboard />} />
      <Route path="/app/meeting/:type" element={<TeamPage />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);