const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job",
  },
  deadline: {
    type: String,
    default: "",
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  fileLink: {
    type: Buffer
  },
});
module.exports = mongoose.model("project", projectSchema);