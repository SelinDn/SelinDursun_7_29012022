import React from "react";
import Log from "../../components/Log";
import Img from "../../img/icon-above-font.png";
import "./Auth.css";

function Auth() {
    return (
        <div>
            <section>
                <Log login={false} register={true} />
                <div>
                    <img src={Img} alt="Logo de l'entreprise" />
                </div>
                <h1>Bienvenue chez Groupomania</h1>
                <p>Inscrivez-vous dès à présent et rejoignez vos collègues</p>
            </section>
        </div>
    );
};

export default Auth;