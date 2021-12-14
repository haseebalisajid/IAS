const algorithm=require('../models/algorithm.model');
const project=require('../models/projectAssesment.model');
const questionnarie=require('../models/questionnarie.model');
const recorded=require('../models/recorded.model');
const result=require('../models/result.model');
const job=require('../../job/models/job.model');
const live=require('../models/liveInterview.model');
const video=require('../models/videoCall.model');
const nodemailer = require("nodemailer");
const fetch = require("cross-fetch");

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


exports.projectAssesmentRemarks=async(req,res)=>{
    const {jobID,userID,remarks}=req.body;
    if(jobID && userID){
        try{
            const getResult=await result.find({jobID:jobID,userID:userID});
            if(getResult[0].allComplete==true ){
                if(getResult[0].projectRemarks==''){
                    if(remarks){
                        const addRemarks =await result.updateOne(
                          { jobID: jobID, userID: userID },
                          {
                            $set: {
                              projectRemarks: remarks,
                            },
                          }
                        );
                        res.status(200).json({'msg':'Remarks added'});
                    }
                    else{
                        res.status(400).json({'msg':'Please add remarks'})
                    }
                }
                else{
                    res.status(403).json({'msg':'Remarks already submitted'})
                }
            }
            else{
                res.status(401).json({'msg':'Project not submitted yet'})
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({'msg':'Opps error. we are looking into it.'})
        }
    }
    else{
        res.status(400).json({'msg':"jobID or userID is missing"});
    }
}

exports.recordedResult=async(req,res)=>{
    const { jobID } = req.params;
    if(jobID){
        try{
            const getResult=await result.find({jobID:jobID},{recordedResult:true,userID:true}).populate('userID','name');
            res.status(200).json(getResult);
        }
        catch(err){
            console.log(err);
            res.status(500).json({'msg':'Oops Error. We are looking into it.'})
        }
    }   
    else{
        res.status(400).json({'msg':'jobID is missing'})
    }
}


exports.questionnarieResult = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const getResult = await result
        .find({ jobID: jobID }, { mcqResult: true, userID: true })
        .populate("userID", "name");
      res.status(200).json(getResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Oops Error. We are looking into it." });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};


exports.algorithmResult = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const getResult = await result
        .find({ jobID: jobID }, { algorithmResult: true, userID: true })
        .populate("userID", "name");
      res.status(200).json(getResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Oops Error. We are looking into it." });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.projectResult = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const getResult = await result
        .find({ jobID: jobID }, { projectLink: true, userID: true })
        .populate("userID", "name");
      res.status(200).json(getResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Oops Error. We are looking into it." });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.getFinalList=async(req,res)=>{
    const {jobID}=req.params;
    if(jobID){
        try{
            const getList=await result.find({allComplete:true},{userID:true}).populate('userID','name email');
            if(getList.length>0){
                res.status(200).json(getList);
            }
            else{
                res.status(404).json({'msg':"No Data found"});
            }
        }
        catch(err){
            res.status(500).json({'msg':'Oops Error, we are looking into it.'})
        }
    }
    else{
        res.status(400).json({'msg':'jobID is missing'});
    }
}

//scheduling live interview
exports.scheduleRoom=async  (req,res)=>{
    const{userID,jobID,startTime}=req.body;
    if(userID && jobID){
        if(startTime!=''){
            try{
                const jobDetail=await job.find({_id:jobID},{title:true});
                let title=jobDetail[0].title;
                title = title.replace(/ /g, "-");
                var adminLink;
                const response=await fetch("https://api.daily.co/v1/rooms", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.live_key}`,
                  },
                  body: JSON.stringify({
                    name: `${title}-Interview`,
                    privacy: "private",
                    properties: {
                      nbf: startTime,
                      enable_screenshare: false,
                      enable_knocking: true,
                      enable_chat: true,
                      start_video_off: true,
                      start_audio_off: true,
                    },
                  }),
                });
                const data=await response.json();

                const response2 = await fetch(
                  "https://api.daily.co/v1/meeting-tokens",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${process.env.live_key}`,
                    },
                    body: JSON.stringify({
                      properties: {
                        room_name: `${data.name}`,
                        is_owner: true,
                      },
                    }),
                  }
                );
                const data2=await response2.json();
                adminLink = data.url + `?t=${data2.token}`;

                let liveInterview = await new live({
                    jobID: jobID,
                    userID: userID,
                    adminLink: adminLink,
                    userLink: data.url,
                    startTime: startTime,
                    companyID:req.USER._id
                });
                let liveInter = await liveInterview.save();
                res.status(200).json(liveInter);
            }
            catch(err){
                console.log(err);
                res.status(500).json({'msg':'Oops error, we are looking into it.'})
            }
        }
        else{
            res.status(400).json({'msg':'Add start time'})
        }
    }
    else{
        res.status(400).json({'msg':'JobID or userID is missing'})
    }
}

exports.showScheduledRooms=async(req,res)=>{
    try {
        const data = await live
        .find({ companyID: req.USER._id }, { userLink: false })
        .populate("userID", "name").populate('jobID','title');
        if (data.length > 0) {
        res.status(200).json(data);
        } else {
        res.status(404).json({ msg: "No data found" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Oops Error,, we are looking into it." });
    }
}

exports.showVideoRequests=async(req,res)=>{
    try{
        const data=await video.find({companyID:req.USER._id});
        if(data.length>0){
            res.status(200).json(data);
        }
        else{
            res.status(404).json({'msg':"No data found"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({'msg':"Oops error. We are looking into it."});
    }
}

exports.setVideoCall=async(req,res)=>{
    const {ID,startTime}=req.body;
    if(ID){
        if(startTime){
            try{
                const getData=await video.find({_id:ID});
                if(getData[0].adminLink=='' &&  getData[0].userLink==''){
                    let num=Math.floor(Math.random() * 50)+1;;
                    var adminLink;
                    const response=await fetch("https://api.daily.co/v1/rooms", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.live_key}`,
                    },
                    body: JSON.stringify({
                        name: `VideoCall-${num}`,
                        privacy: "private",
                        properties: {
                        nbf: startTime,
                        enable_screenshare: false,
                        enable_knocking: true,
                        enable_chat: true,
                        start_video_off: true,
                        start_audio_off: true,
                        },
                    }),
                    });
                    const data=await response.json();

                    const response2 = await fetch(
                    "https://api.daily.co/v1/meeting-tokens",
                    {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.live_key}`,
                        },
                        body: JSON.stringify({
                        properties: {
                            room_name: `${data.name}`,
                            is_owner: true,
                        },
                        }),
                    }
                    );
                    const data2=await response2.json();
                    adminLink = data.url + `?t=${data2.token}`;
                    const updateData=await video.updateOne(
                        {_id:ID},
                        {
                            $set:{
                                adminLink:adminLink,
                                userLink:data.url,
                                startTime:startTime
                            }
                        }
                    );
                    res.status(200).json({'msg':'Video call setup completed'});
                }
                else{
                    res.status(403).json({'msg':'Already setup'})
                }
            }
            catch(err){
                console.log(err);
                res.status(500).json({'msg':'Oops Error. We are looking into it.'})
            }
        }
        else{
            res.status(400).json({'msg':'start time is missing'});
        }
    }
    else{
        res.status(400).json({'msg':'ID is missing'});
    }
}

exports.setResponse=async(req,res)=>{
    const {ID,response}=req.body;
    if(ID){
        if(response){
            try{
                const getData=await video.find({_id:ID});
                if(getData[0].adminLink=='' &&  getData[0].userLink==''){
                    if(getData[0].response==''){
                        const updateData=await video.updateOne(
                            {_id:ID},
                            {
                                $set:{
                                    response:response
                                }
                            }
                        );
                        res.status(200).json({'msg':'Response Set'});
                    }
                    else{
                        res.status(403).json({'msg':'Already set response'});
                    }
                }
                else{
                    res.status(401).json({'msg':'You set video call already, cant set response.'})
                }
            }
            catch(err){
                console.log(err);
                res.status(500).json({'msg':'Oops Error, We are looking into it.'})
            }
        }
        else{
            res.status(400).json({'msg':'please write response'});
        }
    }
    else{
        res.status(400).json({'msg':'ID is missing'});
    }
}

//applicants controllers for interviews
exports.showLiveRooms=async(req,res)=>{
    try{
        const data=await live.find({userID:req.USER._id},{adminLink:false}).populate('companyID','name').populate('jobID','title');
        if(data.length>0){
            res.status(200).json(data);
        }
        else{
            res.status(404).json({'msg':'No data found'});
        }
    }
    catch(err){
        res.status(500).json({'msg':'Oops Error,, we are looking into it.'})
    }
}

exports.getUserStates = async (req, res) => {
  const { jobID, userID } = req.params;
  if ((jobID, userID)) {
    try {
      const Result = await result.find(
        { jobID: jobID, userID: userID },
        { recorded: true, mcq: true, algorithm: true, projecetAssesment: true }
      );
      res.status(200).json(Result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
    }
  } else {
    res.status(401).json({ msg: "userID or jobID is missing" });
  }
};

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

const checker = (arr) => {
    return arr.every((v) => v === true);
};

exports.submitAlgorithm = async (req, res) => {
  const { jobID, resultArray } = req.body;
  if (jobID) {
    try {
      const checkResult = await result.find({
        jobID: jobID,
        userID: req.USER._id,
      });
        const getSelected = await job
        .find({ _id: jobID }, { selected: true, title: true })
        .populate("company", "name");

      const getMcq=await questionnarie.find({jobID:jobID});
      const length=getMcq[0].questions.length;
      const percent = Math.round((checkResult[0].mcqResult / length) * 100);
      const check=checker(resultArray);
          //checking user valid for this test or not
        if (
            checkResult[0].algorithm == true &&
            checkResult[0].algorithmResult.length == 0
        ) {
            //checking user answers array
            if(percent>60 && check == true){
                if (resultArray.length > 0) {
                    const updateResult = await result.updateOne(
                        { jobID: jobID, userID: req.USER._id },
                        {
                        $set: {
                            algorithm: false,
                            algorithmResult: resultArray,
                            projecetAssesment: true,
                        },
                        }
                    );
                    if(updateResult.nModified ==1){
                        let htmlTemp = `<p>Dear <strong>${req.USER.name} ,</strong></p>
                        <p>This is to inform you that you qualified for the next Interview Phase for the <strong>${getSelected[0].title}</strong> postion
                        at <strong>${getSelected[0].company.name}</strong>.<br>
                        Please visit your IAS dashboard to start the next interview ASAP.<br><strong>Best of Luck.</strong></P>
                        <strong>Regards:</strong><br>
                        <p>IAS.Offical.Team</p>`;
                        transporter.sendMail({
                          to: req.USER.email,
                          subject: "Job Interview Update",
                          html: htmlTemp,
                        });
                    }
                    res.status(200).json({ msg: "Result Submitted" });
                } else {
                    res
                    .status(400)
                    .json({ msg: "Total Number is missing" });
                }              
            }
            else{
                const updateResult = await result.updateOne(
                    { jobID: jobID, userID: req.USER._id },
                    {
                    $set: {
                        algorithm: false,
                        algorithmResult: resultArray,
                        projecetAssesment: false,
                    },
                    }
                );
                if (updateResult.nModified == 1) {
                    let htmlTemp = `<p>Dear <strong>${req.USER.name} ,</strong></p>
                        <p>This is to inform you that you are not qualified for the next Interview Phase for the <strong>${getSelected[0].title}</strong> postion
                        at <strong>${getSelected[0].company.name}</strong>.<br>
                        Thank you for using IAS.<br><strong>Best luck next time.</strong></P>
                        <strong>Regards:</strong><br>
                        <p>IAS.Offical.Team</p>`;
                    transporter.sendMail({
                        to: req.USER.email,
                        subject: "Job Interview Update",
                        html: htmlTemp,
                    });
                }
                res.status(200).json({ msg: "you are not qualified for the next phase. Better luck next time" });
            }
        } else {
            res.status(401).json({ msg: "cant submit right now" });
        }
    } catch (err) {
        console.log(err)
      res.status(500).json({ msg: err });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.submitProject=async(req,res)=>{
    const {jobID,link}=req.body;
    if(jobID){
        if(link!=''){
            try{
                const checkResult = await result.find({
                    jobID: jobID,
                    userID: req.USER._id,
                });
                if(checkResult[0].projectAssesment == true 
                    && checkResult[0].projectRemarks=="" 
                    && checkResult[0].projectLink ==""
                ){
                    const updateResult = await result.updateOne(
                      { jobID: jobID, userID: req.USER._id },
                      {
                        $set: {
                          projectAssesment: false,
                          projectLink: link,
                          allComplete: true,
                        },
                      }
                    );
                    res.status(200).json({'msg':'Project Submitted'});
                }
                else{
                    res.status(401).json({'msg':'cant submit right now'});
                }
            }
            catch(err){
                console.log(err);
                res.status(500).json({'msg':'Opps error, we are looking into it'})
            }
        }
        else{
            res.status(400).json({'msg':'Project Link is missing'})
        }
    }
    else{
        res.status(400).json({'msg':'JobID is missing'})
    }
}

exports.showRecordedInterview=async(req,res)=>{
    const {jobID}=req.params;
    if(jobID){
        try{
            const showResult=await recorded.find({jobID:jobID});
            res.status(200).json(showResult);
        }
        catch(err){
            console.log(err);
            res.status(500).json({'msg':err})
        }
    }
    else{
        res.status(400).json({'msg':"jobID is missing"})
    }
}

exports.showQuestionnarieInterview = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const showResult = await questionnarie.find({ jobID: jobID });
      res.status(200).json(showResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.showAlgorithmInterview = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const showResult = await algorithm.find({ jobID: jobID });
      res.status(200).json(showResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.showProjectAssesment = async (req, res) => {
  const { jobID } = req.params;
  if (jobID) {
    try {
      const showResult = await project.find({ jobID: jobID });
      res.status(200).json(showResult);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
    }
  } else {
    res.status(400).json({ msg: "jobID is missing" });
  }
};

exports.pingVideoCall=async(req,res)=>{
    const {jobID,problemStatement}=req.body;
    if(jobID){
        if(problemStatement){
            try{
                const checkResult=await video.find({jobID:jobID,userID:req.USER._id});
                const checkInterview=await result.find({jobID:jobID,userID:req.USER._id});
                const jobData=await job.find({_id:jobID}).populate('company','name');
                
                if(checkInterview.length>0 && checkInterview[0].projectAssesment == true){
                    if (checkResult.length == 0) {
                        const videoCall = await new video({
                        jobID,
                        problemStatement,
                        userID: req.USER._id,
                        companyID:jobData[0].company._id
                        });
                        const saveData = await videoCall.save();
                        res.status(200).json({
                        response: saveData,
                        msg: "Successfuly pinged company HR",
                        });
                    } else {
                        res
                        .status(401)
                        .json({ msg: "already pinged" });
                    }
                }
                else{
                    res.status(401).json({'msg':'cant ping right now'});
                }
            }
            catch(err){
                console.log(err);
                res.status(500).json({'msg':"Oops Error, we are looking into it."})
            }
        }
        else{
            res.status(400).json({'msg':'Problem statement is missing'});
        }
    }
    else{
        res.status(400).json({'msg':"jobID is missing."});
    }
}

