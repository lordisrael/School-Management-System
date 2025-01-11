const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    resources: [String], // e.g., whiteboards, projectors
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Students enrolled in the classroom
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
