const express = require("express");
const authMiddleware = require("../mws/_auth.mw");
const router = express.Router();


const {createUser} = require('../controllers/userCtrl')

router.post("/register", createUser);


module.exports = router;