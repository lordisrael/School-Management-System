const express = require("express");
const authMiddleware = require("../mws/_auth.mw");
const router = express.Router();


const {createUser, loginUser} = require('../controllers/userCtrl')

router.post("/register", createUser);
router.post("/login",loginUser )


module.exports = router;