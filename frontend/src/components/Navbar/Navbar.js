import React, { useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import Logo from "../../img/icon-left-font-monochrome-white.png";
import "../Navbar/Navbar.css";

function Navbar() {
    const [token, setToken] = useState(true);

    useEffect(() => {
        setToken(localStorage.getItem("Token"));
    }, []
    );
    
    const logOut = () => {
        localStorage.clear();
        window.location.href = "/";
    }

    return (
        <nav>
            <div className="nav-container">
                {token ? (
                    <ul>
                        <li className="nav-profil">
                            <NavLink exact to="/profil">
                                <p>Profil</p>
                            </NavLink>
                        </li>
                        <li className="nav-logout" onClick={logOut}>
                            <NavLink exact to="/">
                                <p>Se déconnecter</p>
                            </NavLink>
                        </li>
                    </ul>
                ) : (
                    <div className="nav-logo">
                        <NavLink exact to="/">
                            <div className="nav-logo">
                                <img src={Logo} alt="Logo de l'enseigne" className="nav-img"/>
                            </div>
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;