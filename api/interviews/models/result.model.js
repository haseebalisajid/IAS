const mongoose = require("mongoose");

const interviewResult=mongoose.Schema({
    jobID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    recorded:{
        type:Boolean,
        default:true
    },
    mcq:{
        type:Boolean,
        default:false
    },
    algorithm:{
        type:Boolean,
        default:false
    },
    projectAssesment:{
        type:Boolean,
        default:false
    },
    recordedResult:{ 
        type:Array,
        default:[]
    },
    mcqResult:{
        type:Number,
        default:null
    },
    algorithmResult:{
        type:Array,
        default:[]
    },
    projectLink:{
        type:String,
        default:'',
    },
    projectRemarks:{
        type:String,
        default:''
    },
    allComplete:{
        type:Boolean,
        default:false
    }
});


module.exports = mongoose.model("interviewResult", interviewResult);