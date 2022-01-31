const express = require("express");
const router = express.Router();
//const auth = require();
const likeCtrl = require("../controllers/like");

router.post('/:id', auth, likeCtrl.createLike);


module.exports = router;