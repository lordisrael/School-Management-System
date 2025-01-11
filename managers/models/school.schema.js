const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactEmail: { type: String, required: true },
    administrators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Refers to school administrators
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
    // Refers to classrooms under the school
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);
module.exports = School;
