const db = require("../models/index");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const fs = require("fs");
const post = require("../models/post");

// Récupération de tout les posts 
exports.getAllPosts = (req, res, next) => {
    Post.findAll({ order: [['createdAt', 'DESC']], include: [{model: User}, {model:Comment}] })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error}));
};

// Récupération des posts d'un utilisateur
exports.getPostsByUser = (req, res, next) => {
    Post.findAll({ order: [['createdAt', 'DESC']], include: {model: User}, where: {userId: req.params.id} })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error}));
};

const regExp = /^[^ "<>*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_!]+$/;

// Création
exports.createPost = (req, res, next) => {
    if (!regExp.test(req.body.content)) {
        return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
    }
    else if (!req.body.content) {
        return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
    }
    const post = req.file ? {
        ...req.body,
        attachment : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        like: 0,
        userId: req.auth.userId,
    } : {
        ...req.body,
        like:0,
        userId: req.auth.userId,
    }
    Post.create(post)
    .then(() => res.status(201).json({ message: 'Post enregistré et ajouté !'}))
    .catch(error => res.status(400).json({ error}));
};

// Modification 
exports.modifyPost = (req, res, next) => {
    Post.findOne({where: {id: req.params.id} })
    .then((post) => {
        if (!regExp.test(req.body.content)) {
            return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
        }
        else if (!req.body.content) {
            return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
        }
        else if (post.userId === req.auth.userId || req.auth.isAdmin) {
            post.update({ content: req.body.content })
            .then(() => res.status(200).json({ message: "Post modifié" }))
            .catch((error) => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};

// Suppression 
exports.deletePost = (req, res, next) => {
    Post.findOne({where: {id: req.params.id} })
    .then((post) => {
        if (post.userId === req.auth.userId || req.auth.isAdmin) {
            if (post.attachment !== null) {
                const filename = post.attachment.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    post.destroy({ where: { id: req.params.id} })
                    .then(() => res.status(200).json({ message: 'Post supprimé !'}))
                    .catch(error => res.status(400).json({error}))
                });
            }
            post.destroy({ where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Post supprimé !'}))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};