const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customerID: {
    type: String,
  },
  checkoutID: {
    type: String,
  },
  subscriptionID: {
    type: String,
    default:''
  },
  periodStart: {
    type: String,
    default:''
  },
  periodEnd: {
    type:String,
    default:''
  },
  status: {
    type: String,
    default:''
  },
});

module.exports = mongoose.model("subscription", subscriptionSchema);
