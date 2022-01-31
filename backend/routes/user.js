const express = require("express");
const router = express.Router();
const passwordValidator = require("../middleware/password-validator");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const userCtrl = require("../controllers/user");

router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;