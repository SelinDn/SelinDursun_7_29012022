const express = require("express");
const router = express.Router();
//const auth = require();
//const multer = require();
const postCtrl = require("../controllers/post");

router.get('/', auth, postCtrl.getAllPosts);
router.get('/users/:id', auth, postCtrl.getPostsByUser);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);


module.exports = router;