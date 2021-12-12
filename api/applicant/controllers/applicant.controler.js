const mongoose = require("mongoose");
const applicant = require('../models/applicantProfile.model');
const User = require("../../user/models/user.model");
const Job=require('../../job/models/job.model')
const nodemailer = require("nodemailer");
const passwordValidator = require("../../validators/password.validator");
const profileValidator = require("../../validators/applicantProfile.validator");
const Complain=require('../../user/models/complain.model')
const Bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: process.env.EMAIL_USERNAME,
});

//profile setup
exports.applicantProfile=async (req,res)=>{
  console.log('in applicant profile')
  const data=req.body;
  // console.log('data: ',data)
  try{
    const validator = profileValidator.applicantProfile;
    const value = await validator.validateAsync(data);
    // console.log(value.title);
    const Applicant = await new applicant({
      userID: req.USER._id,
      title: value.title,
      mobileNo: value.mobileNo,
      DOB: value.DOB,
      gender: value.gender,
      profileImage: value.profileImage,
      resume: value.resume,
      address: value.address,
      description: value.description,
      education: value.education,
      experience: value.experience,
      skills: value.skills,
    });
    try {
      console.log('in try ')
      let ApplicantData = await Applicant.save();
      console.log(ApplicantData)
      const updateUser = await User.updateOne(
        { _id: req.USER._id },
        {
          $set: {
            profileSetup: true,
          },
        }
      );
      res.status(200).json(ApplicantData);
    } catch (err) {
      console.log(err)
      res.status(500).json({msg:'something went wrong'});
    }
  }
  catch(err){
    console.log(err)
    res.status(500).send(err.details[0].message);
  }
    
}

//updating profile
exports.updateProfile = async (req, res) => {
  const data=req.body;
  try{
      const validator = profileValidator.applicantProfile;
      let value = await validator.validateAsync(data);
      value.updatedAt=Date.now();
      try {
        const updateProfile = await applicant.updateOne(
          { userID: req.USER._id },
          value
        );
        res.status(200).send("Profile Updated");
      } catch (err) {
        res.status(401).send(err);
      }
  }
  catch(err){
    res.status(401).send(err.details[0].message);
  }

};

//password change
exports.applicantChangePassword=async(req,res)=>{
  const { oldPassword, newPassword } = req.body;

  //checking old password of user
  passwordCheck = await Bcrypt.compare(oldPassword, req.USER.password);

  if (passwordCheck) {
    try {
      const validator = passwordValidator.passwordSchema;
      const value = await validator.validateAsync({
        password: newPassword,
      });
      encryptedPassword = await Bcrypt.hash(value.password, 10);
      try {
        // Step 3 - Email the user a unique verification link
        const updateUser = await User.updateOne(
          { _id: req.USER._id },
          {
            $set: {
              password: encryptedPassword,
            },
          }
        );
        let htmlTemp = `Your password has changed. <br>Regards: IAS Team`;
        transporter.sendMail({
          to: req.USER.email,
          subject: "Password Change",
          html: htmlTemp,
        });
        res.status(201).json({
          message: "Your password has changed",
        });
      } catch (err) {
        res.status(500).send(err);
      }
    } catch (err) {
      res.status(401).send(err.details[0].message);
    }
  } else {
    res.status(401).json({
      msg: "Not matched with old password",
    });
  }
}

//apply for a job
exports.applyForJob=async(req,res)=>{
  const { jobID, userExp } = req.body;
  if (jobID && userExp) {
    const user = await User.findById(req.USER._id);
    const jobData = await Job.findById(jobID);

    if (jobData.active) {
      if (
        jobData.applied.includes(req.USER._id) ||
        jobData.selected.includes(req.USER._id) ||
        jobData.rejected.includes(req.USER._id) ||
        user.applied.includes(jobID)
      ) {
        res.status(403).json({ msg: "already applied" });
      } else {
        try {
          if (req.USER.profileSetup===true) {
            const dat = {
              userID: mongoose.Types.ObjectId(req.USER._id),
              userExp: userExp,
            };
            const updateJobApplied = await Job.updateOne(
              { _id: jobID },
              {
                $push: {
                  applied: dat,
                },
              }
            );

            const updateApplicantApplied = await User.updateOne(
              { _id: req.USER._id },
              {
                $push: {
                  applied: jobID,
                },
              }
            );
            res.status(200).json({
              msg: "Applied for the job",
            });
          } else {
            res.status(401).send("Set your profile first");
          }
        } catch (err) {
          console.log(err)
          res.status(500).json({"msg":err});
        }
      }
    } else {
      res.status(401).json({ msg: "This job is closed now" });
    }
  } else {
    res.status(403).json({ msg: "Job ID or userExp is missing" });
  }   
}
//getProfileData
exports.getApplicantProfile=async(req,res)=>{
  const userID=req.USER._id;
  if(userID){
    try{
      const userData=await applicant.find({userID:userID});
      if(userData.length>0){
        res.status(200).json(userData);
      }
      else{
        res.status(404).json({msg:'profile not setup'});
      }
      
    }
    catch(err){
      res.status(401).send('something went wrong')
    }
  }
  else{
    res.status(403).send('user ID not found');
  }
}

//submit complain
exports.submitComplain=async(req,res)=>{
  try {
    const complainsCount = await Complain.find({ userID: req.USER._id });
    var count = 0;
    //getting active complains
    if (complainsCount.length > 0) {
      complainsCount.map((dat) => {
        if (dat.status === "pending" || dat.status === "working") {
          count = count + 1;
        }
      });
    }
    //applying some conditions on active complains
    if (count < 4) {
      const { title, description } = req.body;
      if (title && description) {
        const complain = await new Complain({
          title: title,
          description: description,
          userID: req.USER._id,
        });
        try {
          let complainData = await complain.save();
          res.status(200).send("complain send");
        } catch (err) {
          res.status(500).send("something went wrong.");
        }
      } else {
        res.status(204).send("Fill all fields");
      }
    } else {
      res
        .status(403)
        .send(`Cant Complain when you already have ${count} active complains`);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

//complains count
exports.getActiveComplainsCount = async (req, res) => {
  try {
    const complainsData = await Complain.find({ userID: req.USER._id });
    var count = 0;
    //getting active complains
    if (complainsData.length > 0) {
      complainsData.map((dat) => {
        if (dat.status === "pending" || dat.status === "working") {
          count = count + 1;
        }
      });
    }
    res.status(200).json({ 'Total Complains': complainsData.length , 'Active Complains':count});
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};
