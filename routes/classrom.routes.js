const express = require("express");
const authMiddleware = require("../mws/_auth.mw");
const isSuperAdmin = require("../mws/_isSuperadmin.mw");
const isSchoolAdmin = require("../mws/isSchoolAdmin.mw")
const router = express.Router();

const {
  createClassroom,
  getAllClassrooms,
  getAClassroom,
  updateClassroom,
  deleteClassroom
} = require("../controllers/classroomCtrl");

router.post("/register", authMiddleware, isSchoolAdmin, createClassroom);
router.get("/get_all_classroom", authMiddleware, isSchoolAdmin, getAllClassrooms)
router.get(
  "/get_a_classroom/:classroomId",
  authMiddleware,
  isSchoolAdmin,
  getAClassroom
);
router.patch(
  "/update_classroom/:classroomId",
  authMiddleware,
  isSchoolAdmin,
  updateClassroom
);
router.delete(
  "/delete_classroom/:classroomId",
  authMiddleware,
  isSchoolAdmin,
  deleteClassroom
);

module.exports = router;
