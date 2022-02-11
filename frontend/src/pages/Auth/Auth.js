import React from "react";
import Log from "../../components/Log";
import Img from "../../img/icon-above-font.png";
import "./Auth.css";

// Page d'authentification

function Auth() {
    return (
        <section className="log-container">
            <Log login={false} register={true} />
            <div className="img-container">
                <img src={Img} alt="Logo de l'entreprise" />
            </div>
            <h1 className="auth-title">Bienvenue chez Groupomania</h1>
            <p className="auth-description">Inscrivez-vous dès à présent et rejoignez vos collègues</p>
        </section>
    );
};

export default Auth;