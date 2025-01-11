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

const {enrollStudent, getAStudent, getAllStudent, removeStudent, transferStudent} = require("../controllers/studentCtrl")

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

router.post(
  "/:classroomId/student/register",
  authMiddleware,
  isSchoolAdmin,
  enrollStudent
);

router.get("/:classroomId/get_all_students", authMiddleware, isSchoolAdmin, getAllStudent)
router.get("/:classroomId/get_a_student/:studentId/", authMiddleware, isSchoolAdmin, getAStudent)
router.delete("/:classroomId/student/:studentId", authMiddleware, isSchoolAdmin, removeStudent)
router.patch("/:classroomId/student/:studentId/transfer", authMiddleware, isSchoolAdmin, transferStudent)

module.exports = router;
