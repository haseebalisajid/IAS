const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const block = require("../../middleware/block");
const interviewController=require('../controller/interviews.controller')

//company side routes
router.post('/createRecordedInterview',auth,role('company'),block,interviewController.recordedInterview);
router.post('/createQuestionnarie',auth,role('company'),block,interviewController.questionnarieInterview);
router.put('/addQuestions/:interviewID',auth,role('company'),block,interviewController.addQuestionnarie);
router.post('/createAlgorithmInterview',auth,role('company'),block,interviewController.algorithmInterview);
router.put('/addAlgorithmQuestions/:interviewID',auth,role('company'),block,interviewController.addAlgorithmQuestions);
router.post('/createProjectAssesment',auth,role('company'),block,interviewController.projectAssesment);
router.put('/startInterviews',auth,role('company'),block,interviewController.startInterviews);
router.get('/getUserStates/:jobID/:userID',auth,role('company'),block,interviewController.getUserStates);

//applicant side routes
router.put(
  "/submitQuestionnarie",
  auth,
  role("applicant"),
  block,
  interviewController.submitMCQ
);

module.exports=router;