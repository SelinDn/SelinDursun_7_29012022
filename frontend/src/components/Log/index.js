import React, { useState } from "react";
import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";

// Création du component Log pour paramétrer les modals d'authentification

function Log(props) {
    const [registerModal, setRegisterModal] = useState(props.register);
    const [logInModal, setLogInModal] = useState(props.login);

    const handleModals = (e) => {
        if (e.target.id === "register") {
            setLogInModal(false);
            setRegisterModal(true);
        }
        else if (e.target.id === "login") {
            setRegisterModal(false);
            setLogInModal(true);
        }
    }
    
    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    <li 
                        onClick={handleModals} 
                        id="register" 
                        className={registerModal ? "active-btn" : null}
                    >
                        S'inscrire
                    </li>
                    <li 
                        onClick={handleModals} 
                        id="login" 
                        className={logInModal ? "active-btn" : null}
                    >
                        Se connecter
                    </li>
                </ul>
                {registerModal && <RegisterForm />}
                {logInModal && <LogInForm />}
            </div>
        </div>
    );
};

export default Log;