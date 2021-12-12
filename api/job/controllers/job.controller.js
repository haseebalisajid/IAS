const Job = require('../models/job.model');
const User=require('../../user/models/user.model');

exports.getAllJobs = async (req, res) => {
  const resPerPage = 10; // results per page
  const page = req.params.page || 1; // Page
  if (req.query.search && req.query.type) {
    const search = new RegExp(escapeRegex(req.query.search), "gi");
    switch (req.query.type) {
      case "title":
        try {
          const jobs = await Job.find({ title: search, active: true })
            .sort({ createdAt: -1 })
            .populate("company", "name")
            .skip(resPerPage * page - resPerPage)
            .limit(resPerPage);
          const numOfJobs = jobs.length;
          if(numOfJobs>0){
            res.status(200).json({
              Result: jobs,
              currentPage: page,
              pages: Math.ceil(numOfJobs / resPerPage),
              searchVal: `Search: ${req.query.search} & Type: ${req.query.type}`,
              TotalJobs: numOfJobs,
            });
          }
          else{
            res.status(200).json({"msg":"No jobs found"})
          }
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
        break;
      case "skills":
        try {
          const jobs = await Job.find({ skills: search, active: true })
            .sort({ createdAt: -1 })
            .populate("company", "name")
            .skip(resPerPage * page - resPerPage)
            .limit(resPerPage);
          const numOfJobs = jobs.length;

          if (numOfJobs > 0) {
            res.status(200).json({
              Result: jobs,
              currentPage: page,
              pages: Math.ceil(numOfJobs / resPerPage),
              searchVal: `Search: ${req.query.search} & Type: ${req.query.type}`,
              TotalJobs: numOfJobs,
            });
          } else {
            res.status(200).json({ msg: "No jobs found" });
          }
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
        break;
    }
  } else {
    try {
      const jobs = await Job.find({ active: true })
        .sort({ createdAt: -1 })
        .populate("company", "name")
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      const numOfJobs = jobs.length;

      res.status(200).json({
        Result: jobs,
        currentPage: page,
        pages: Math.ceil(numOfJobs / resPerPage),
        TotalJobs: numOfJobs,
      });

    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  }
};



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
