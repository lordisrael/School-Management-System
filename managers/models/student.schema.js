const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactInformation: { type: String },
    grades: { type: Map, of: Number }, // Key-value pairs for grades (e.g., { "Math": 85, "English": 90 })
    currentClassroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    }, // Classroom association
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    }, // School association
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
