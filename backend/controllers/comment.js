const db = require("../models/index");
const User = db.user;
const Comment = db.comment;
const Post = db.post;

const regExp = /^[^ "<>*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_!]+$/;

// Création 
exports.createComment = (req, res, next) => {
    if (!regExp.test(req.body.content)) {
        return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
    }
    else if (!req.body.content) {
        return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
    }
    const comment = {
        ...req.body,
        userId : req.auth.userId,
        postId : req.body.postId
    };
    Comment.create(comment)
    .then(() => res.status(201).json({ message: 'Commentaire enregistré et ajouté !'}))
    .catch(error => res.status(400).json({ error}));
};

// Modification
exports.modifyComment = (req, res, next) => {
    Comment.findOne({where: {id: req.params.id} })
    .then((comment) => {
        if (!regExp.test(req.body.content)) {
            return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
        }
        else if (!req.body.content) {
            return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
        }
        else if (comment.userId === req.auth.userId || req.auth.isAdmin) {
            comment.update({ content: req.body.content })
            .then(() => res.status(200).json({ message: "Commentaire modifié !" }))
            .catch((error) => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};

// Récupération de tout les commentaires 
exports.getAllComments = (req, res, next) => {
    Comment.findAll({ order: [['createdAt', 'DESC']], where: { postId: req.params.id }, include: [{model: User},{ model:Post} ]})
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({ error}));
};

// Suppression 
exports.deleteComment = (req, res, next) => {
    Comment.findOne({where: {id: req.params.id} })
    .then((comment) => {
        if (comment.userId === req.auth.userId || req.auth.isAdmin) {
            comment.destroy({ where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};