const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    resources: { type: String }, // e.g., whiteboards, projectors
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    }, // School association
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Students enrolled in the classroom
  },
  { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
