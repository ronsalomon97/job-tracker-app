import express from 'express';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router(); 

router.post ('/' , authMiddleware, async (req,res) => {
    const { company, title, status, dateApplied, notes } = req.body;

    try {
        const newJob = new Job({
            company, 
            title,
            status,
            dateApplied,
            notes,
            user: req.userId
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    
    } catch (error) {
        res.status(500).json({ massage: "Error creating job", error: error.massage});
    }
});

router.get('/', authMiddleware, async (req,res) => {

    try {
        // +++++++++ we can add query parameters for filtering/searching if needed. ++++++++++
        // ---------                                                                ----------
        const jobs = await Job.find({ user: req.userId });
        res.json(jobs);
         
    } catch (error) {
        res.status(500).json({ massage: 'Error fetching jobs', error: error.massage });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        
      const job = await Job.findOne({ _id: req.params.id, user: req.userId });
      if (!job){
         return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);

    } catch (error) {
      res.status(500).json({ message: "Error fetching job", error: error.message });
    }
  });       

  router.put('/:id', authMiddleware, async (req, res) => {
    const { company, title, status, dateApplied, notes } = req.body;
    try {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { company, title, status, dateApplied, notes },
        { new: true, runValidators: true } // This returns the updated document and validates the update
      );
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Error updating job", error: error.message });
    }
  });
  
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
      if (!deletedJob) return res.status(404).json({ message: "Job not found" });
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting job", error: error.message });
    }
  });

  router.get('/stats', authMiddleware, async (req, res) => {
    try {
      // Count jobs by status for the logged-in user. Using aggregate(mongo)
      const stats = await Job.aggregate([
        { $match: { user: req.userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
  });
  

  export default router;

// More complex stats ----------------------------- Maybe add later 

//   router.get('/stats', authMiddleware, async (req, res) => {
//     try {
//       // 1. Group by job status to get counts for each status.
//       const statusStats = await Job.aggregate([
//         {
//           $match: {
//             user: mongoose.Types.ObjectId(req.userId)
//           }
//         },
//         {
//           $group: {
//             _id: "$status",
//             count: { $sum: 1 }
//           }
//         }
//       ]);
  
//       // 2. Group by year and month to create a time trend.
//       //    This groups jobs by the year and month extracted from the dateApplied field.
//       const trendStats = await Job.aggregate([
//         {
//           $match: {
//             user: mongoose.Types.ObjectId(req.userId)
//           }
//         },
//         {
//           $group: {
//             _id: {
//               year: { $year: "$dateApplied" },
//               month: { $month: "$dateApplied" }
//             },
//             count: { $sum: 1 }
//           }
//         },
//         {
//           $sort: { "_id.year": 1, "_id.month": 1 }
//         }
//       ]);
  
//       // 3. (Optional) Calculate additional metrics, e.g., average per month.
//       //    This example calculates the average number of jobs per month.
//       const totalJobsResult = await Job.aggregate([
//         {
//           $match: {
//             user: mongoose.Types.ObjectId(req.userId)
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             totalJobs: { $sum: 1 }
//           }
//         }
//       ]);
//       const totalJobs = totalJobsResult.length ? totalJobsResult[0].totalJobs : 0;
//       const months = trendStats.length;
//       const avgJobsPerMonth = months > 0 ? totalJobs / months : 0;
  
//       res.json({
//         statusStats,
//         trendStats,
//         additionalMetrics: {
//           totalJobs,
//           months,
//           avgJobsPerMonth
//         }
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching stats", error: error.message });
//     }
//   });
  