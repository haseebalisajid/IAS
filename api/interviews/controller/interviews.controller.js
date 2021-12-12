const algorithm=require('../models/algorithm.model');
const project=require('../models/projectAssesment.model');
const questionnarie=require('../models/questionnarie.model');
const recorded=require('../models/recorded.model');
const result=require('../models/result.model');
const job=require('../../job/models/job.model');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: process.env.EMAIL_USERNAME,
});

exports.recordedInterview=async(req,res)=>{
    const { jobID, totalTime, testName, deadline, questions } = req.body;
    if(jobID){
        const jobData=await job.find({_id:jobID});
        if(jobData[0].company.toString() == req.USER._id.toString()){
            if(questions.length>0){
                if(totalTime<=10){
                    const Recorded=await new recorded({
                        jobID,
                        totalTime,
                        testName,
                        deadline,
                        questions
                    });
                    try{
                        let Interview=await Recorded.save();
                        res.status(200).json({'Response':Interview,'msg':'Interview Created'});
                    }
                    catch(err){
                        res.status(500).json({'msg':err})
                    }
                }
                else{
                    res.status(401).json({msg:"max time limit is 10 min"})
                }
            }
            else{
                res.status(400).json({'msg':'please add questions'})
            }
        }
        else{
            res.status(401).json({'msg':'This job is not posted by your company'})
        }
    }
    else{
        res.status(401).json({'msg':'Job Id is missing'})
    }
}

exports.questionnarieInterview=async(req,res)=>{
    const { jobID, totalTime, testName, deadline, questions } = req.body;
    if(jobID){
        const jobData=await job.find({_id:jobID});
        if(jobData[0].company.toString() == req.USER._id.toString()){
            if(questions.length>0){
                if(questions.length<=15){
                    const mcq=await new questionnarie({
                        jobID,
                        totalTime,
                        deadline,
                        testName,
                        questions
                    });
                    try{
                        let questionnaries=await mcq.save();
                        res.status(200).json({'Response':questionnaries,'msg':'Interview Created'});
                    }
                    catch(err){
                        console.log(err)
                        res.status(500).json({'msg':err})
                    }
                }
                else{
                    res.status(401).json({msg:"MCQ max limit is 15"})
                }
            }
            else{
                res.status(400).json({'msg':'please add questions'})
            }
        }
        else{
            res.status(401).json({'msg':'This job is not posted by you'})
        }
    }
    else{
        res.status(401).json({'msg':'Job Id is missing'})
    }
}

exports.addQuestionnarie=async(req,res)=>{
    const {questions} =req.body;
    const interviewID=req.params.interviewID
    const findInterview=await questionnarie.find({_id:interviewID}).populate('jobID','name company');
    console.log(findInterview)
    if(findInterview[0].edit){
        if(findInterview[0].jobID.company.toString() == req.USER._id.toString()){
            if(findInterview[0].questions.length<=15){
                if(questions.length>0){
                    try{
                        const addQuestion=await questionnarie.updateOne(
                            {_id:interviewID},
                            {
                                $push:{
                                    questions:questions
                                }
                            }
                        )
                        res.status(200).json({'msg':'questions added'});
                    }
                    catch(err){
                        console.log(err)
                        res.status(500).json({'msg':err})
                    }
                }
                else{
                    res.status(400).json({'msg':'Please add questions'})
                }
            }
            else{
                res.status(401).json({msg:"MCQ max limit is 15"})
            }
        }
        else{
            res.status(401).json({'msg':'This job is not posted by your company'})
        }
    }
    else{
        res.status(403).json({'msg':'cant edit interview now'})
    }
}

exports.algorithmInterview=async(req,res)=>{
    const { jobID, totalTime, testName, deadline, questions } = req.body;
    if(jobID){
        const jobData=await job.find({_id:jobID});
        const checkExist=await algorithm.find({jobID:jobID});
        if(!checkExist.length>0){
            if(jobData[0].company.toString() == req.USER._id.toString()){
                if(questions.length>0){
                    if(questions.length<=5){
                        const algorithm=await new algorithm({
                            jobID,
                            totalTime,
                            deadline,
                            testName,
                            questions
                        });
                        try{
                            let algorithmInterview=await algorithm.save();
                            res.status(200).json({'Response':algorithmInterview,'msg':'Interview Created'});
                        }
                        catch(err){
                            console.log(err)
                            res.status(500).json({'msg':err})
                        }
                    }
                    else{
                        res.status(401).json({msg:"Algorithm questions max limit is 5"})
                    }
                }
                else{
                    res.status(400).json({'msg':'please add questions'})
                }
            }
            else{
                res.status(401).json({'msg':'This job is not posted by you'})
            }
        }
        else{
            res.status(409).json({'msg':'Already added algorithm interview for this job'})
        }
    }
    else{
        res.status(401).json({'msg':'Job Id is missing'})
    }

}


exports.addAlgorithmQuestions=async(req,res)=>{
    const {questions} =req.body;
    const interviewID=req.params.interviewID
    const findInterview=await algorithm.find({_id:interviewID}).populate('jobID','name company');
    if(findInterview[0].edit){
        if(findInterview[0].jobID.company.toString() == req.USER._id.toString()){
            if(findInterview[0].questions.length<=5){
                if(questions.length>0){
                    try{
                        const addQuestion=await algorithm.updateOne(
                            {_id:interviewID},
                            {
                                $push:{
                                    questions:questions
                                }
                            }
                        )
                        res.status(200).json({'msg':'questions added'});
                    }
                    catch(err){
                        console.log(err)
                        res.status(500).json({'msg':err})
                    }
                }
                else{
                    res.status(400).json({'msg':'Please add questions'})
                }
            }
            else{
                res.status(401).json({msg:"MCQ max limit is 5"})
            }
        }
        else{
            res.status(401).json({'msg':'This job is not posted by your company'})
        }
    }
    else{
        res.status(403).json({'msg':'cant edit interview now'})
    }
}

// exports.randomAlgoQuestions=async(req,res)=>{
//     const {}=req.body;
// }

exports.projectAssesment=async(req,res)=>{
    const {jobID,deadline,testName,instructions,fileLink}=req.body;
    if(jobID){
        try{
            const checkProject=await project.find({jobID:jobID});
            if(!checkProject.length>0){
                const Project=await new project({
                    jobID,
                    deadline,
                    testName,
                    instructions,
                    fileLink
                });
                let setProject=await Project.save();
                res.status(200).json({'msg':'Project Assesment set','Response':setProject});
            }
            else{
                res.status(409).json({'msg':'already set project assesment'})
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json({msg:err})
        }
    }
    else{
        res.status(401).json({'msg':'JobID is missing'})
    }

}

exports.startInterviews=async(req,res)=>{
    const {jobID}=req.body;
    if(jobID){
        try{
            const getSelected=await job.find({_id:jobID},{selected:true,title:true}).populate('selected','name email').populate('company','name');
            const data=getSelected[0].selected;
            let resultLength=await result.find({jobID:jobID});
            resultLength=resultLength.length;
            if(resultLength!=data.length){
                await data.map(async (val)=>{
                    let resultData=await result.find({jobID:jobID,userID:val._id});
                    let Result=await new result({
                        jobID,
                        userID:val._id,
                    });
                    let saved=await Result.save();
                    let htmlTemp = `<p>Dear <strong>${val.name} ,</strong></p>
                    <p>This is to inform you that your interview for the <strong>${getSelected[0].title}</strong> postion
                    at <strong>${getSelected[0].company.name}</strong> has started.<br>
                    Please visit your IAS dashboard to start the interview ASAP.<br><strong>Best of Luck.</strong></P>
                    <strong>Regards:</strong><br>
                    <p>IAS.Offical.Team</p>`;
                    transporter.sendMail({
                        to: val.email,
                        subject: "Job Interview Update",
                        html: htmlTemp,
                    });

                });
                let changeAlgo=await algorithm.updateOne({jobID:jobID},
                        {
                            $set:{
                                edit:false
                            }
                        }
                );
                let changeQuestionnarie=await questionnarie.updateOne(
                    {jobID:jobID},
                    {
                        $set:{
                            edit:false
                        }
                    }
                )
                return res.status(200).json({'msg':"Emails sent to all selected applicants",'response':`Interview started for the ${getSelected[0].title} job`})
            }
            else{
                return res.status(409).json({'msg':'already started interview for this job'})
            }
        }
        catch(err){
            console.log("err");
            return res.status(500).json({'msg':err})
        }
    }
    else{
        return res.status(401).json({'msg':'jobID is missing'});
    }
}

exports.getUserStates=async(req,res)=>{
    const {jobID,userID}=req.params;
    if(jobID,userID){
        try{
            const Result=await result.find({jobID:jobID,userID:userID},{recorded:true,mcq:true,algorithm:true,projecetAssesment:true});
            res.status(200).json(Result);
        }
        catch(err){
            console.log(err);
            res.status(500).json({'msg':err})
        }
    }
    else{
        res.status(401).json({'msg':'userID or jobID is missing'})
    }
}

//applicants controllers
exports.submitMCQ=async(req,res)=>{
    const {jobID,totalNumber}= req.body;
    if(jobID){
        try{
            const checkResult=await result.find({jobID:jobID,userID:req.USER._id});
            if(checkResult[0].mcq == true && checkResult.mcqResult==null){
                if(totalNumber){
                    const updateResult = await result.updateOne(
                        { jobID: jobID, userID: req.USER._id },
                        {
                        $set: {
                            mcq: false,
                            mcqResult: totalNumber,
                            algorithm:true,
                        },
                        }
                    );
                    res.status(200).json({'msg':'Result Submitted'});
                }
                else{
                    res.status(400).json({'msg':'Total Number is missing'});
                }
            }
            else{
                res.status(401).json({'msg':'cant submit right now'})
            }
        }
        catch(err){
            res.status(500).json({'msg':err})
        }
    }
    else{
        res.status(400).json({'msg':'jobID is missing'});
    }
}

// exports.submitAlgorithm = async (req, res) => {
//   const { jobID, resultArray } = req.body;
//   if (jobID) {
//     try {
//       const checkResult = await result.find({
//         jobID: jobID,
//         userID: req.USER._id,
//       });
//       if (checkResult[0].algorithm == true && checkResult.algorithmResult.length == 0) {
//         if (resultArray>0) {
//           const updateResult = await result.updateOne(
//             { jobID: jobID, userID: req.USER._id },
//             {
//               $set: {
//                 mcq: algorithm,
//                 mcqResult: totalNumber,
//                 algorithm: true,
//               },
//             }
//           );
//           res.status(200).json({ msg: "Result Submitted" });
//         } else {
//           res.status(400).json({ msg: "Total Number is missing" });
//         }
//       } else {
//         res.status(401).json({ msg: "cant submit right now" });
//       }
//     } catch (err) {
//       res.status(500).json({ msg: err });
//     }
//   } else {
//     res.status(400).json({ msg: "jobID is missing" });
//   }
// };