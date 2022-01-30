const config = require("../config/db.config");
require('dotenv/config');

const Sequelize = require("sequelize");
const user = require("./user");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Importation des modèles 
db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);
db.comment = require("./comment")(sequelize, Sequelize);
db.like = require("./like")(sequelize, Sequelize);

// Associations des modèles
db.user.hasMany(db.post, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});
db.post.belongsTo(db.user, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});

db.post.hasMany(db.comment, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE"});
db.comment.belongsTo(db.post, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE"});

db.user.hasMany(db.comment, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});
db.comment.belongsTo(db.user, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});

db.user.hasMany(db.like, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});
db.like.belongsTo(db.user, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE"});

db.post.hasMany(db.like, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE"});
db.like.belongsTo(db.post, { foreignKey: "postId", onDelete: "CASCADE", onUpdate: "CASCADE"});


module.exports = db;