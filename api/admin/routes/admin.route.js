const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin.controller");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");



router.get('/getApplicants',auth,role('admin'),adminController.getAllApplicants);

router.get("/getCompanies", auth,role('admin'), adminController.getAllCompanies);

router.get(
  "/getSubscriptions",
  auth,
  role("admin"),
  adminController.getSubscriptionsRecord
);

router.get(
  "/getTotalSales",
  auth,
  role("admin"),
  adminController.getTransactionsList
);

router.put("/blockUser/:userID", auth, role("admin"), adminController.blockUser);

router.put(
  "/unBlockUser/:userID",
  auth,
  role("admin"),
  adminController.unBlockUser
);


router.put(
  "/markedAsWorking/:complainID",
  auth,
  role("admin"),
  adminController.markedAsWorking
);

router.put(
  "/markedAsDone/:complainID",
  auth,
  role("admin"),
  adminController.markedAsDone
);

router.get('/getComplains',auth,role('admin'),adminController.getComplains);
router.get('/getAllJobs',auth,role('admin'),adminController.getAllJobs);

router.delete(
  "/deleteJob/:jobID",
  auth,
  role("admin"),
  adminController.deleteJob
);

// router.post(
//   "/reportHook",
//   express.json({ type: "application/json" }),
//   async (request, response) => {
//     const event = request.body;
//     // Handle the event
//     switch (event.type) {
//       case "reporting.report_run.succeeded":
//         let success = event.data.object;
//         console.log("success", success);
//         break;
//       case "reporting.report_run.failed":
//         let failed = event.data.object;
//         console.log("failed", failed);
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//         break;
//     }

//     // Return a response to acknowledge receipt of the event
//     response.json({ received: true });
//   }
// );

module.exports = router;