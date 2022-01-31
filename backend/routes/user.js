const express = require("express");
const router = express.Router();
//const passwordValidator = require();
//const auth = require();
//const multer = require();
const userCtrl = require("../controllers/user");

router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;