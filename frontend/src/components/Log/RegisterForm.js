import React, { useState } from "react";
import axios from "axios";

/**
 * Création du component RegisterForm,
 * Stockage avec les hooks (useState),
 * Logique (handleRegister),
 * Requête avec axios à la db,
 * Puis affichage en jsx.
 */

function RegisterForm() {
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        const msg = document.querySelector(".msg");

        axios({
            method: "POST",
            url: "http://localhost:3001/api/users/signup",
            data: {
                email,
                password,
                pseudo,
            }
        })
        .then((res) => {
            if (res.status === 400) {
                msg.innerHTML = "Adresse mail ou mot de passe invalide"
            }
            else {
                msg.innerHTML = "Compte créé, veuillez vous connecter"
            }
        })
        .catch((error) => console.log(error));
    }

    return (
        <form action="" onSubmit={handleRegister} id="log-form" className="form">
            <label htmlFor="pseudo">Pseudo</label>
            <br />
            <input 
                type="text" 
                name="pseudo" 
                id="pseudo" 
                onChange={(e) => setPseudo(e.target.value)} 
                value={pseudo}
                required 
            />
            <br />
            <label htmlFor="email">Email</label>
            <br />
            <input 
                type="email" 
                name="email" 
                id="email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
            />
            <br />
            <label htmlFor="password">Mot de passe</label>
            <br />
            <input 
                type="password" 
                name="password" 
                id="password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                required 
            />
            <p className="msg"></p>
            <br />
            <input type="submit" value="Je m'inscris" className="btn-form" />
        </form>
    );
};

export default RegisterForm;