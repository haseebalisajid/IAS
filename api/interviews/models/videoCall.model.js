const mongoose = require("mongoose");

const videoCallSchema = mongoose.Schema({
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
    default:''
  },
  userLink: {
    type: String,
    default:''
  },
  startTime: {
    type: String,
    default:''
  },
  problemStatement:{
      type:String,
  },
  roomName:{
    type:String,
    default:''
  },
  response:{
    type:String,
    default:''
  }
});

module.exports = mongoose.model("videoCall", videoCallSchema);
