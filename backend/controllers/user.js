const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
require('dotenv/config');
const db = require("../models/index");
const User = db.user;

// Mise en place de RegExp
const emailRegexp = /^[^ "<>?*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_]+[@]{1}[^ "<>?*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_]+[.]{1}[a-z]{2,20}$/;
const passwordRegexp = /^[^ "<>?*()$.](?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
const regExp = /^[^ "<>?*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_]+$/;

// Inscription  
exports.signup = (req, res, next) => {
    if (!req.body.email && !req.body.password && !req.body.pseudo) {
        return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
    }
    else if (!emailRegexp.test(req.body.email) && !passwordRegexp.test(req.body.password) && !regExp.test(req.body.pseudo)) {
        return res.status(400).json({ message : "Veuillez renseignez une adresse mail valide , un mot de passe valide et un pseudo valide !"})
    };

    // Chiffrement de l'email
    const cryptoEmail = cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString();

    // Création d'un hash du mot de passe avec un niveau de salage à 10
    bcrypt.hash(req.body.password, 10)
    .then(hash => {

        // Création d'un nouvel utilisateur avec le mot de passe haché et email crypté
        const user = {
            email: cryptoEmail,
            password: hash,
            pseudo: req.body.pseudo,
        };

        User.save(user)
        .then(() => res.status(201).json({ message : 'Utilisateur créé !'}))
        .catch( error => res.status(400).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};

// Connexion 
exports.login = (req, res, next) => {
    if (!req.body.email && !req.body.password) {
        return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
    }
    else if (!emailRegexp.test(req.body.email) && !passwordRegexp.test(req.body.password)) {
        return res.status(400).json({ message : "Veuillez renseignez une adresse mail valide et un mot de passe valide !"})
    };

    // Chiffrement de l'email
    const cryptoEmail = cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString(); 

    // Récupération de l'adresse mail et comparaison de l'adresse d'inscription à l'adresse saisie
    User.findOne({ where: {email: cryptoEmail} })
    .then(user => {
        // Dans le cas d'un utilisateur non trouvé
        if (!user) {
            return res.status(401).json({ error : 'Utilisateur introuvable !'});
        }

        bcrypt.compare(req.body.password, user.password)
        .then(valid => { 
            if (!valid) {
                return res.status(401).json({ error : 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                isAdmin: user.isAdmin,
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id, isAdmin: user.isAdmin},
                    process.env.RANDOM_TOKEN_SECRET,
                    { expiresIn: '24h'},
                )
            });
        })
        .catch( error => res.status(500).json({ error }));
        })
    .catch( error => res.status(500).json({ error }));
};

// Retrouver un utilisateur
exports.getOneUser = (req, res, next) => {

};

// Modification 
exports.modifyUser = (req, res, next) => {

};

// Suppression 
exports.deleteUser = (req, res, next) => {

};