import React, { useState } from "react";
import axios from "axios";

/**
 * Création du component LogInForm,
 * Stockage avec les hooks (useState),
 * Logique (handleLogin),
 * Requête avec axios à la db,
 * Puis affichage en jsx.
 */

function LogInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const msg = document.querySelector(".msg");

        axios({
            method: "post",
            url: "http://localhost:3001/api/users/login",
            withCredentials: true,
            data: {
                email,
                password,
            },
        })
        .then((res) => {
            console.log(res)
            if (res.status === 401) {
                msg.innerHTML = "Email ou mot de passe incorrect"
            }
            else {
                localStorage.setItem("Token", res.data.token);
                window.location = "/home";
            }
        })
        .catch((error) => console.log(error));
    }
    
    return (
        <form action="" onSubmit={handleLogin} id="log-form" className="form">
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
            <input type="submit" value="Se connecter" className="btn-form"/>
            <br />
            <p>Mot de passe oublié ? Contactez-nous à l'adresse <br/>
                <strong>helpaccount@groupomania.com</strong>
            </p>
        </form>
    );
};

export default LogInForm;