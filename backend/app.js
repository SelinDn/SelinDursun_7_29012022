const express = require("express");
const cors = require("cors");
const db = require("./config/db.config");

const app = express();

app.use(express.json());
app.use(cors());


// Test de connexion à la db
db.sync()
.then(console.log("Connection has been established successfully."))
.catch(error => console.log("Unable to connect to the database:", error));

// Envoi sur la db
const models = require("./models");
models.sequelize.sync({ alter: true})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to your application." });
  });

module.exports = app;