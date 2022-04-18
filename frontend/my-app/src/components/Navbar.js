import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import URL from '../configurl.json'
export default function Navbar() {
    console.log(URL);
    console.log(URL.ASSETS_BASED_URL);
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
                                <img src={`${URL.ASSETS_BASED_URL}/tpeologo.png`} alt="TPEO logo" />
                            </div>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/app">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/app/meeting/General">
                                    General
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/app/meeting/Design">
                                    Design
                                </NavLink>
                            </li>
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" to="/app/meeting/Product">
                                    Product
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/app/meeting/Engineering">
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