const express = require("express");
const router = express.Router();
//const auth = require();
const commentCtrl = require("../controllers/comment");


router.post('/:id/comments', auth, commentCtrl.createComment);
router.put('/:id/comments/:id', auth, commentCtrl.modifyComment);
router.get('/:id/comments', auth, commentCtrl.getAllComments);
router.delete('/:id/comments/:id', auth, commentCtrl.deleteComment);


module.exports = router;