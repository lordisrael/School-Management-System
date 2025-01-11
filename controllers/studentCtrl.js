const School = require("../managers/models/school.schema");
const Student = require("../managers/models/student.schema")
const Classroom = require("../managers/models/classroom.schema")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { createJWT, createRefreshJWT } = require("../managers/token/jwt");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthenticatedError,
} = require("../errors");

const enrollStudent = asyncHandler(async (req, res) => {
  try {
    const { classroomId } = req.params; // Extract classroomId from the URL parameters
    const { firstName, lastName, contactInformation, grades } = req.body; // Extract student details from the request body

    if (!firstName || !lastName) {
      res.status(400);
      throw new Error("First name and last name are required.");
    }

    const schoolId = req.user.school; // Extract school from req.suser (assumes middleware sets req.suser)

    // Check if the classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      res.status(404);
      throw new Error("Classroom not found.");
    }

    // Create the new student
    const student = await Student.create({
      firstName,
      lastName,
      contactInformation,
      grades,
      currentClassroom: classroomId,
      school: schoolId,
    });

    // Add the student to the classroom's students array
    classroom.students.push(student._id);
    await classroom.save();

    res.status(201).json({
      success: true,
      message: "Student enrolled successfully.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll student.",
    });
  }
});


// Get all students in a specific classroom
const getAllStudent = asyncHandler(async (req, res) => {
  try {
    const { classroomId } = req.params; // Extract classroomId from URL parameters

    // Find all students associated with the given classroomId
    const students = await Student.find({
      currentClassroom: classroomId,
    }).select("-createdAt -updatedAt -currentClassroom -school");

    if (!students || students.length === 0) {
      res.status(404);
      throw new Error("No students found for the given classroom.");
    }

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve students.",
    });
  }
});

// Get a single student in a specific classroom
const getAStudent = asyncHandler(async (req, res) => {
  try {
    const { classroomId, studentId } = req.params; // Extract classroomId and studentId from URL parameters

    // Find the student associated with the given classroomId and studentId
    const student = await Student.findOne({
      _id: studentId,
      currentClassroom: classroomId,
    }).select("-createdAt -updatedAt -currentClassroom -school");

    if (!student) {
      res.status(404);
      throw new Error("Student not found in the given classroom.");
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve the student.",
    });
  }
})

const transferStudent = asyncHandler(async (req, res) => {
  try {
    const { classroomId, studentId } = req.params; // Extract classroomId and studentId from URL parameters
    const { newClassroomId } = req.body; // Extract the target classroom ID from the request body

    if (!newClassroomId) {
      res.status(400);
      throw new Error("Target classroom ID (newClassroomId) is required.");
    }

    // Verify if the new classroom exists
    const targetClassroom = await Classroom.findById(newClassroomId);
    if (!targetClassroom) {
      res.status(404);
      throw new Error("Target classroom not found.");
    }

    // Find the student and verify they belong to the current classroom
    const student = await Student.findOne({
      _id: studentId,
      currentClassroom: classroomId,
    });
    if (!student) {
      res.status(404);
      throw new Error("Student not found in the specified classroom.");
    }

    // Update the student's currentClassroom
    student.currentClassroom = newClassroomId;
    await student.save();

    // Remove the student from the current classroom's students array
    await Classroom.findByIdAndUpdate(classroomId, {
      $pull: { students: studentId },
    });

    // Add the student to the new classroom's students array
    await Classroom.findByIdAndUpdate(newClassroomId, {
      $addToSet: { students: studentId }, // Ensures no duplicates
    });

    res.status(200).json({
      success: true,
      message: "Student transferred successfully.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to transfer student.",
    });
  }
});


const removeStudent = asyncHandler(async (req, res) => {
  try {
    const { classroomId, studentId } = req.params; // Extract classroomId and studentId from URL parameters

    // Find and delete the student from the classroom
    const student = await Student.findOneAndDelete({
      _id: studentId,
      currentClassroom: classroomId,
    });

    if (!student) {
      res.status(404);
      throw new Error("Student not found in the specified classroom.");
    }

    // Remove the student from the classroom's students array
    await Classroom.updateOne(
      { _id: classroomId },
      { $pull: { students: studentId } } // Remove the studentId from the students array
    );

    res.status(200).json({
      success: true,
      message: "Student removed from classroom successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove student.",
    });
  }
});


const updateStudent = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params; // Extract studentId from URL parameters
    const { contactInformation, grades } = req.body; // Extract the fields to update from the request body

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404);
      throw new Error("Student not found.");
    }

    // Update the fields if provided
    if (contactInformation) student.contactInformation = contactInformation;
    if (grades) student.grades = grades;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update student.",
    });
  }
});


module.exports = {
    enrollStudent,
    getAStudent,
    getAllStudent,
    updateStudent,
    removeStudent,
    transferStudent
}