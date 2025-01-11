const express = require("express");
const authMiddleware = require("../mws/_auth.mw");
const isSuperAdmin = require("../mws/_isSuperadmin.mw");
const router = express.Router();

const { createSchool, getALLSchools, getASchool, deleteSchool, updateSchool } = require("../controllers/schCtrl");

router.post("/register",authMiddleware, isSuperAdmin, createSchool);
router.get("/get_all_schools", authMiddleware, isSuperAdmin, getALLSchools)
router.get("/get_a_school/:id", authMiddleware, getASchool);
router.delete("/delete_school/:id", authMiddleware, isSuperAdmin, deleteSchool)
router.patch("/update_school/:id", authMiddleware, isSuperAdmin,updateSchool)


module.exports = router;
