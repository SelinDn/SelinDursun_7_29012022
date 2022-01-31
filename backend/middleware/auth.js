const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req, res, next) => {
    try {
        // Récupération du token dans l'en-tête authorization et retourner le token du tableau créé avec split
        const token = req.headers.authorization.split(' ')[1];
        // Vérification du token récupéré et de l'userId encodé
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        req.auth = { userId, isAdmin};
        // Si userId différent => throw , sinon fonction next()
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID invalide !';
        }
        // Si isAdmin différent => throw , sinon fonction next()
        else if (req.body.isAdmin && req.body.isAdmin !== isAdmin) {
            throw 'Compte Admin requis !';
        }
        else {
            next();
        }
    } 
    catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};