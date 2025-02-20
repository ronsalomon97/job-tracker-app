import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Advanced Analytics Route
 * This route aggregates job data for the authenticated user:
 * - statusStats: Counts of jobs grouped by status.
 * - trendStats: Jobs grouped by the year and month extracted from the dateApplied field.
 * - additionalMetrics: Total number of jobs and average jobs per month.
 *
 * IMPORTANT: This static route must be defined before any dynamic routes (e.g. /:id) so that a request to /stats does not get caught as a dynamic parameter.
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
      // Convert req.userId (string) to a MongoDB ObjectId.
      const userId = new mongoose.Types.ObjectId(req.userId);
  
      // 1. Group by job status.
      const statusStats = await Job.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      // 2. Group by year and month (trend data).
      const trendStats = await Job.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: "$dateApplied" },
              month: { $month: "$dateApplied" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      // 3. Calculate total jobs (Total Applications).
      const totalJobsResult = await Job.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalJobs: { $sum: 1 } } }
      ]);
      const totalApplications = totalJobsResult.length ? totalJobsResult[0].totalJobs : 0;
  
      // 4. Calculate Active Interviews.
      const activeInterviews = await Job.countDocuments({ user: userId, status: "interview" });
  
      // 5. Calculate Offers Received.
      const offersReceived = await Job.countDocuments({ user: userId, status: "offer" });
  
      // 6. Count distinct companies.
      const companiesResult = await Job.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$company" } },
        { $group: { _id: null, companyCount: { $sum: 1 } } }
      ]);
      const companies = companiesResult.length ? companiesResult[0].companyCount : 0;
  
      // 7. Calculate months (using trendStats length) and average jobs per month.
      const months = trendStats.length;
      const avgJobsPerMonth = months > 0 ? totalApplications / months : 0;
  
      res.json({
        statusStats,     // e.g., [{ _id: "applied", count: 5 }, ...]
        trendStats,      // e.g., [{ _id: { year: 2025, month: 2 }, count: 3 }, ...]
        additionalMetrics: {
          totalApplications,  // Total jobs
          activeInterviews,
          offersReceived,
          companies,
          months,
          avgJobsPerMonth
        }
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
  });
  
  // --- Other job routes (POST, GET, GET/:id, PUT, DELETE) should follow here
  // (Make sure the /stats route is placed above any dynamic routes like /:id)
    
/**
 * POST /api/jobs
 * Create a new job.
 */
router.post('/', authMiddleware, async (req, res) => {
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
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
});

/**
 * GET /api/jobs
 * Retrieve all jobs for the authenticated user.
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

/**
 * GET /api/jobs/:id
 * Retrieve a specific job by its ID.
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
});

/**
 * PUT /api/jobs/:id
 * Update a specific job by its ID.
 */
router.put('/:id', authMiddleware, async (req, res) => {
  const { company, title, status, dateApplied, notes } = req.body;
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { company, title, status, dateApplied, notes },
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
});

/**
 * DELETE /api/jobs/:id
 * Delete a specific job by its ID.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
});

export default router;
