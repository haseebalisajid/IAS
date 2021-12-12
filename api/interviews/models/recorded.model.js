const mongoose = require("mongoose");

const recordedSchema=mongoose.Schema({
    jobID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        unique:true
    },
    totalTime:{
        type:Number,
        required:true
    },
    testName:{
        type:String,
        required:true,
    },
    deadline:{
        type:String,
        required:true
    },
    questions:{
        type:Array,
        required:true
    }
})
module.exports = mongoose.model("recordedInterview", recordedSchema);


/*
state management{
    jobID
    userID
    recordedShow:false
}
*/