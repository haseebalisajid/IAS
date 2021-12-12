const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  salary: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  applied: [
    {
      userID:{
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      userExp:{
        type:Number
      },
    },
  ],
  selected: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  rejected: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  interview:{
    type:Boolean,
    default:false
  },
  active: {
    type: Boolean,
    default: true,
  },
  endDate: {
    type: String,
  },
});

// jobSchema.index({'title':'text','skills':'text'});

module.exports = mongoose.model("job", jobSchema);
