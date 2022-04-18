import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
    var navItemStyle = {
        "fontFamily": 'Montserrat',
        "fontStyle": "normal",
        "fontWeight": "400",
        "fontSize": "18px",
        "lineHeight": "22px",
        color: "#000000"
    }
    return (
        <div className="navigation">
            <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <div>
                        <div className="navbar-brand">
                            <div className="logo-image">
                                <img src="tpeologo.png" class="img-fluid" alt="TPEO logo" />
                            </div>
                        </div>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/formpage/checkinForm">
                                    Check-in Form
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/formpage/excusedAbsenceForm">
                                    Excused Absense Form
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/formpage/memberTable">
                                    Member Attendance Table
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}