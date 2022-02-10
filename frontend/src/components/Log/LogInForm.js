import React, { useState } from "react";
import axios from "axios";

function LogInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const emailError = document.querySelector(".email-error");
        const passwordError = document.querySelector(".password-error");

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
            if (res.data.errors) {
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password;
            }
            else {
                localStorage.setItem("Token", res.data.token);
                window.location = "/home";
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    return (
        <form action="" onSubmit={handleLogin} id="login-form">
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
            <div className="email-error"></div>
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
            <div className="password-error"></div>
            <br />
            <input type="submit" value="Se connecter" />
            <br />
            <p>Mot de passe oublié ? Contactez-nous à l'adresse <br/>
                <strong>helpaccount@groupomania.com</strong>
            </p>
        </form>
    );
};

export default LogInForm;