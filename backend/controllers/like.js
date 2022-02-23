const db = require("../models/index");
const User = db.user;
const Like = db.like;
const Post = db.post;

// Création 
exports.createLike = (req, res, next) => {
   Like.findOne({where: {userId : req.auth.userId, postId : req.body.postId}, include: {model: User, model: Post} })
   .then((like) => {
        if (!like) {
            Like.create({userId: req.auth.userId, postId: req.body.postId}),
            Post.increment({ like: +1}, { where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: "Like pris en compte !"}))
            .catch((error) => res.status(400).json({ error }));
        }
        else {
            Like.destroy({where: {userId: req.auth.userId, postId: req.body.postId}}),
            Post.decrement({ like: +1}, { where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Avis déja pris en compte !'}))
            .catch((error) => res.status(400).json({ error }));
        }
    })
    .catch((error) => res.status(404).json({ error }));
};