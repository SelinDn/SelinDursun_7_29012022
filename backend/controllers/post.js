const db = require("../models/index");
const User = db.user;
const Post = db.post;
const fs = require("fs");

// Récupération de tout les posts 
exports.getAllPosts = (req, res, next) => {
    Post.findAll({ order: [['createdAt', 'DESC']], include: {model: User} })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error}));
};

// Récupération des posts d'un utilisateur
exports.getPostsByUser = (req, res, next) => {
    Post.findAll({ order: [['createdAt', 'DESC']], include: {model: User}, where: {id: req.params.id} })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error}));
};

const regExp = /^[^ "<>?*()$][a-zA-Z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ ,.'-_]+$/;

// Création
exports.createPost = (req, res, next) => {
    // Passage String => JS Object pour pouvoir créer la sauce
    const postObject = JSON.parse(req.body);
    if (!regExp.test(req.body.content)) {
        return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
    }
    else if (!req.body.content) {
        return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
    }
    const post = {
        ...postObject,
        userId : req.body.userId,
        // Récupérer tout les segments d'URL de l'image
        attachment : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    };
    Post.create(post)
    .then(() => res.status(201).json({ message: 'Post enregistré et ajouté !'}))
    .catch(error => res.status(400).json({ error}));
};

// Modification 
exports.modifyPost = (req, res, next) => {
    Post.findOne({where: {id: req.params.id} })
    .then((post) => {
        if (post.userId !== req.auth.userId  || User.isAdmin !== true) {
            return res.status(403).json({
                error: new Error('Requête non autorisée !')
            }); 
        }
        else if (post.attachment !== null || post.attachment !==undefined) {
            const filename = post.attachment.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.destroy({ attachment: req.body.attachment }, { where: { id: req.params.id} })
                .then(() => res.status(200).json({ message: 'Post modifié !'}))
                .catch(error => res.status(400).json({error}))
            });
        }
        else {
            const post = req.file ? 
            {
                ...JSON.parse(req.body),
                attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body, userId : req.body.userId }; 
            // Contrôle des champs de saisies
            if (!regExp.test(req.body.content)) {
                return res.status(500).json({ message : 'Les caractères spéciaux ne sont pas autorisés, veillez à bien remplir les champs'})
            }
            else if (!req.body.content) {
                return res.status(400).json({ message: "Veuillez ne pas laisser les champs vides !"})
            }
            Post.update({ where: { id: req.params.id} }), ( post, { where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Post modifié !'}))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};

// Suppression 
exports.deletePost = (req, res, next) => {
    Post.findOne({where: {id: req.params.id} })
    .then((post) => {
        if (post.userId !== req.auth.userId  || User.isAdmin !== true) {
            return res.status(403).json({
                error: new Error('Requête non autorisée !')
            }); 
        }
        else if (post.attachment !== null || post.attachment !==undefined) {
            const filename = post.attachment.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.destroy({ where: { id: req.params.id} })
                .then(() => res.status(200).json({ message: 'Post supprimé !'}))
                .catch(error => res.status(400).json({error}))
            });
        }
        else {
            Post.destroy({ where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Post supprimé !'}))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(500).json({ error}));
};