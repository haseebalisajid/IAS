require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require('./api/user/routes/user.route');
const applicantRoutes=require('./api/applicant/routes/applicant.route');
const companyRoutes = require("./api/company/routes/company.route");
const jobRoutes=require('./api/job/routes/job.route');
const Subscriptions=require('./api/company/models/subscription.model');
const Job=require('./api/job/models/job.model');
const User=require('./api/user/models/user.model');
const adminRoutes=require('./api/admin/routes/admin.route');
const interviewRoutes=require('./api/interviews/routes/interviews.route')
const cron = require("node-cron");
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
//set up mongoDB connection
// var corsOptions = {
//   origin: ["http://localhost:3000"],
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to mongo.");
  })
  .catch((err) => {
    console.log("Error connecting to mongo.", err);
  });



  app.use(express.urlencoded({ limit: "50mb", extended: true })); 
  app.use(
    express.json({ limit: "50mb" })
  );

// routes
app.get('/',(req,res)=>{
  res.json({msg:"Hello g"})
})


app.use("/api",userRoutes );

app.use("/api/applicant", applicantRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/company/interviews',interviewRoutes)

app.get("/success", (req, res) => {
  res.send("Payment successful");
});

app.get("/failed", (req, res) => {
  res.send("Payment failed");
});

// */2 * * * *
// 0 0 * * *
// */10 * * * * *
//writing a cron job to check subscription end-Date and update the following fields in DB
var subscriptionCronJob = cron.schedule("0 */12 * * *", async () => {
  let date = new Date().getTime();
  date = Math.floor(date / 1000);
  //get all users
  const allUsers = await User.find({ subscribed: true }).populate(
    "subscriptionID",
    "periodEnd"
  );
  //mapping on all users
  allUsers.map(async (val) => {
    if (val.subscriptionID.periodEnd < date) {
      //if its passed then set the subscribed variable false and empty the subscription ID field
      let updateSubscription = await User.updateOne(
        { _id: val._id },
        {
          $set: {
            subscribed: false,
            subscriptionID: "",
          },
        }
      );
    }
  });
});

var jobCronJob = cron.schedule("0 */6 * * *", async () => {
  let date = new Date().getTime();
  date = Math.floor(date / 1000);
  const allJobs = await Job.find({ active: true });
  allJobs.map(async (val) => {
    if (val.endDate < date) {
      const updateJob = Job.updateOne(
        { _id: val._id },
        {
          $set: {
            active: false,
          },
        }
      );
    }
  });
});

// jobCronJob.start();
subscriptionCronJob.start();
const port=process.env.PORT || 4000
app.listen(port, () => {
  console.log("Listening on port: " + port);
}); // tell express to listen on the port
