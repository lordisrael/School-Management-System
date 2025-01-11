const User = require("../managers/models/user.schema");
const School = require("../managers/models/school.schema")
const Classroom = require('../managers/models/classroom.schema')
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

const createClassroom = asyncHandler(async (req, res) => {
  const { name, capacity, resources } = req.body;

  // Validate the required fields for the classroom
  if (!name || !capacity) {
    throw new BadRequestError("Classroom name and capacity are required.");
  }

  // Get the school ID from the logged-in user's data
  const schoolId = req.user.school;
  console.log(req.user);

  // Find the school and ensure it exists and belongs to the logged-in user
  const school = await School.findOne({
    _id: schoolId,
  });
  console.log(school);
  if (!school) {
    throw new NotFoundError(
      "School not found or you do not have permission to add classrooms to this school."
    );
  }

  // Create the classroom
  const classroom = await Classroom.create({
    name,
    capacity,
    resources,
    createdBy: req.user._id,
  });

  // Add the classroom to the school's classrooms array using findByIdAndUpdate
  await School.findByIdAndUpdate(
    schoolId,
    { $push: { classrooms: classroom._id } },
    { runValidators: false } // Skip full document validation
  );

  res.status(StatusCodes.CREATED).json({
    message: "Classroom created successfully.",
    classroom,
  });
});

const getAllClassrooms = asyncHandler(async (req, res) => {
  const schoolId = req.user.school;

  // Validate the school exists
  const school = await School.findById(schoolId).populate("classrooms");
  if (!school) {
    throw new NotFoundError("School not found.");
  }

  res.status(StatusCodes.OK).json({
    message: "Classrooms fetched successfully.",
    classrooms: school.classrooms,
  });
});


const getAClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const schoolId = req.user.school;

  // Validate the classroom belongs to the school
  const school = await School.findById(schoolId);
  if (!school || !school.classrooms.includes(classroomId)) {
    throw new NotFoundError("Classroom not found in your school.");
  }

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new NotFoundError("Classroom not found.");
  }

  res.status(StatusCodes.OK).json({
    message: "Classroom fetched successfully.",
    classroom,
  });
});

const deleteClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const schoolId = req.user.school;

  // Validate the classroom belongs to the school
  const school = await School.findById(schoolId);
  if (!school || !school.classrooms.includes(classroomId)) {
    throw new NotFoundError("Classroom not found in your school.");
  }

  // Remove classroom from school's classrooms array
  await School.findByIdAndUpdate(schoolId, {
    $pull: { classrooms: classroomId },
  });

  // Delete the classroom
  await Classroom.findByIdAndDelete(classroomId);

  res.status(StatusCodes.OK).json({
    message: "Classroom deleted successfully.",
  });
});


const updateClassroom = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const {capacity, resources } = req.body;
  const schoolId = req.user.school;

  // Validate the classroom belongs to the school
  const school = await School.findById(schoolId);
  if (!school || !school.classrooms.includes(classroomId)) {
    throw new NotFoundError("Classroom not found in your school.");
  }

  // Update the classroom
  const classroom = await Classroom.findByIdAndUpdate(
    classroomId,
    { capacity, resources },
    { new: true, runValidators: true }
  );

  if (!classroom) {
    throw new NotFoundError("Classroom not found.");
  }

  res.status(StatusCodes.OK).json({
    message: "Classroom updated successfully.",
    classroom,
  });
});



module.exports = {
    createClassroom,
    getAllClassrooms,
    getAClassroom,
    deleteClassroom,
    updateClassroom
}