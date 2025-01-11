const express = require("express");
const authMiddleware = require("../mws/_auth.mw");
const isSuperAdmin = require("../mws/_isSuperadmin.mw");
const isSchoolAdmin = require("../mws/isSchoolAdmin.mw")
const router = express.Router();

const {
  updateStudent
} = require("../controllers/studentCtrl");

router.patch("/:studentId", authMiddleware, isSchoolAdmin, updateStudent )


module.exports = router;
