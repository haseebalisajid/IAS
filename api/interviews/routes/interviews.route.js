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
router.post(
  "/randomAlgorithm",
  auth,
  role("company"),
  block,
  interviewController.setRandomAlogrithm
);
router.put('/addAlgorithmQuestions/:interviewID',auth,role('company'),block,interviewController.addAlgorithmQuestions);
router.post('/createProjectAssesment',auth,role('company'),block,interviewController.projectAssesment);
router.put('/startInterviews',auth,role('company'),block,interviewController.startInterviews);
router.put(
  "/addProjectRemarks",
  auth,
  role("company"),
  block,
  interviewController.projectAssesmentRemarks
);

router.get(
  "/getRecordedResult/:jobID",
  auth,
  role("company"),
  block,
  interviewController.recordedResult
);

router.get(
  "/getQuestionnarieResult/:jobID",
  auth,
  role("company"),
  block,
  interviewController.questionnarieResult
);

router.get(
  "/getAlgorithmResult/:jobID",
  auth,
  role("company"),
  block,
  interviewController.algorithmResult
);

router.get(
  "/getProjectResult/:jobID",
  auth,
  role("company"),
  block,
  interviewController.projectResult
);

router.get(
  "/getFinalList/:jobID",
  auth,
  role("company"),
  block,
  interviewController.getFinalList
);

router.post('/scheduleLiveInterview',auth,role('company'),block,interviewController.scheduleRoom);

router.get(
  "/getScheduledRooms",
  auth,
  role("company"),
  block,
  interviewController.showScheduledRooms
);


router.get('/getVideoRequests',auth,role('company'),block,interviewController.showVideoRequests);

router.put('/setupVideoCall',auth,role('company'),block,interviewController.setVideoCall);

router.put('/setResponse',auth,role('company'),block,interviewController.setResponse);



//applicant side routes

router.get(
  "/getLiveRooms",
  auth,
  role("applicant"),
  block,
  interviewController.showLiveRooms
);


router.get(
  "/getUserStates/:jobID/:userID",
  auth,
  role("applicant"),
  block,
  interviewController.getUserStates
);

router.get(
  "/getRecorded/:jobID",
  auth,
  role("applicant"),
  block,
  interviewController.showRecordedInterview
);

router.get(
  "/getQuestionnarie/:jobID",
  auth,
  role("applicant"),
  block,
  interviewController.showQuestionnarieInterview
);

router.get(
  "/getAlgorithm/:jobID",
  auth,
  role("applicant"),
  block,
  interviewController.showAlgorithmInterview
);

router.get(
  "/getProjectAssesment/:jobID",
  auth,
  role("applicant"),
  block,
  interviewController.showProjectAssesment
);

router.put(
  "/submitQuestionnarie",
  auth,
  role("applicant"),
  block,
  interviewController.submitMCQ
);

router.put(
  "/submitAlgorithm",
  auth,
  role("applicant"),
  block,
  interviewController.submitAlgorithm
);

router.put(
  "/submitProject",
  auth,
  role("applicant"),
  block,
  interviewController.submitProject
);

router.post(
  "/pingCompany",
  auth,
  role("applicant"),
  block,
  interviewController.pingVideoCall
);

module.exports=router;