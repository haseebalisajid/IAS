const mongoose = require("mongoose");

const mcqSchema=mongoose.Schema({
    jobID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        unique:true,
    },
    totalTime:{
        type:Number,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    testName:{
        type:String,
        required:true,
    },
    edit:{
        type:Boolean,
        default:true
    },
    questions:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model("questionnarie", mcqSchema);