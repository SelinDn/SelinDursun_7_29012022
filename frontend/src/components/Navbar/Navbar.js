import React, { useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import {Link} from "react-router-dom";
import Logo from "../../img/icon-left-font-monochrome-white.png";
import "../Navbar/Navbar.css";
import jwt_decode from "jwt-decode";

function Navbar() {
    const [token, setToken] = useState(true);
  /*  const token = localStorage.getItem("Token");
    const decoded = jwt_decode(token);
    const user = decoded["userId"];*/
    const user = localStorage.getItem("userId");
    
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
                <div className="nav-logo">
                    <NavLink exact to="/home">
                        <div className="nav-logo">
                            <img src={Logo} alt="Logo de l'enseigne" className="nav-img"/>
                        </div>
                    </NavLink>
                </div>
                {token ? (
                    <ul className="nav-list">
                        <li className="nav-profil">
                            <Link to={`/profil/${user}`}>
                                <p>Profil</p>
                            </Link>
                        </li>
                        <li className="nav-logout" onClick={logOut}>
                            <NavLink exact to="/">
                                <p>Se déconnecter</p>
                            </NavLink>
                        </li>
                    </ul>
                ) : (
                    <div className="nav-logo">
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;