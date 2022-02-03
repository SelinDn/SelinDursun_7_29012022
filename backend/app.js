const express = require("express");
const cors = require("cors");
const db = require("./config/db.config");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");

// Importation des routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const likeRoutes = require("./routes/like");


const app = express();

// Securité
app.use(helmet());
app.use(morgan('combined'));
app.use(xss());

app.use(express.json());
app.use(cors());


// Test de connexion à la db
db.sync()
.then(console.log("Connection has been established successfully."))
.catch(error => console.log("Unable to connect to the database:", error));

// Envoi sur la db
const models = require("./models");
models.sequelize.sync({ alter: true})


// Traitement des requêtes pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// EndPoints
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/posts', likeRoutes);


module.exports = app;