const mongoose = require("mongoose");

const liveSchema = mongoose.Schema({
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminLink: {
    type: String,
  },
  roomName:{
    type:String,
    default:''
  },
  userLink: {
    type: String,
  },
  startTime: {
    type: String,
  },
});

module.exports = mongoose.model("liveInterview", liveSchema);
