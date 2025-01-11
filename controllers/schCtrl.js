const School = require("../managers/models/school.schema")
const mongoose = require('mongoose')
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

const createSchool = asyncHandler(async(req, res) => {
  const { name, address, contactEmail } = req.body;

  // Check for missing fields
  if (!name || !address || !contactEmail) {
    res.status(400);
    throw new Error("Please provide all required fields: name, address, and contactEmail.");
  }

  try {
    // Create a new school
    const school = await School.create({
      name,
      address,
      contactEmail,
      createdBy: req.user._id, // Automatically set to the currently logged-in user
    });

    // Return the newly created school
    res.status(201).json(school);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to create school. Please try again.");
  }
})

const getALLSchools = asyncHandler(async(req, res) => {
    try {
      const schools = await School.find().populate({
        path: "createdBy",
        select: "-password -role -createdAt -updatedAt", // Exclude these fields
      });
      res.status(200).json(schools);
    } catch (error) {
      res.status(500);
      throw new Error("Failed to fetch schools. Please try again.");
    }
})

const getASchool = asyncHandler(async(req, res) => {
     const { id } = req.params;

     try {
       const school = await School.findById(id).populate(
         "createdBy"
       );

       if (!school) {
         res.status(404);
         throw new Error("School not found.");
       }

       res.status(200).json(school);
     } catch (error) {
       res.status(500);
       throw new Error("Failed to fetch school. Please try again.");
     }
})

const updateSchool = asyncHandler(async(req, res) => {
    const { id } = req.params;
  const { address } = req.body;

  if (!address) {
    res.status(400);
    throw new Error("Address field is required to update the school.");
  }

  try {
    const school = await School.findById(id);

    if (!school) {
      res.status(404);
      throw new Error("School not found.");
    }

    // Update the address field only
    school.address = address;
    const updatedSchool = await school.save();

    res.status(200).json("School address updated successfully");
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update school. Please try again.");
  }

})

const deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const school = await School.findById(id);

    if (!school) {
      res.status(404);
      throw new Error("School not found.");
    }
    // Delete the school
    await school.deleteOne({ _id: id });
    res.status(200).json({ message: "School deleted successfully." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});



const removeSchoolAdminstartor = asyncHandler(async(req, res) => {

})

module.exports = {
    createSchool,
    getALLSchools,
    getASchool,
    deleteSchool,
    updateSchool
}