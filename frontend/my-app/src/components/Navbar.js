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
            <nav className="navbar navbar-light">
                <div className="container">
                    <div>
                        <a class="navbar-brand" href="/">
                            <div class="logo-image">
                                <img src="tpeologo.png" class="img-fluid" alt="TPEO logo" />
                            </div>
                        </a>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/meeting/General">
                                    General
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/meeting/Design">
                                    Design
                                </NavLink>
                            </li>
                            <li className="nav-item">
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