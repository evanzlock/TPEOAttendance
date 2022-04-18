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
            <nav className="navbar">
                <div className="container">
                    <div>
                        <div className="navbar-brand">
                            <div className="logo-image">
                                <img src="tpeologo.png" alt="TPEO logo" />
                            </div>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/app">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/meeting/General">
                                    General
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/meeting/Design">
                                    Design
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/meeting/Product">
                                    Product
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/meeting/Engineering">
                                    Engineering
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}