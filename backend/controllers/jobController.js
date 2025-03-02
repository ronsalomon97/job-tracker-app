import mongoose from 'mongoose';
import Job from '../models/Job.js';

// Create a new job
export const createJob = async (req, res) => {
  const { company, title, location , status, dateApplied, notes } = req.body;
  try {
    const newJob = new Job({
      company,
      title,
      location,
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
};

// Get all jobs for the authenticated user
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// Get a specific job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};

// Update a specific job by ID
export const updateJob = async (req, res) => {
  const { company, title, location , status, dateApplied, notes } = req.body;
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { company, title, location ,status, dateApplied, notes },
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
};

// Delete a specific job by ID
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};

// Advanced Analytics: Get aggregated job stats.
export const getJobStats = async (req, res) => {
  try {
    // Convert req.userId to ObjectId.
    const userId = new mongoose.Types.ObjectId(req.userId);

    // 1. Group by job status.
    const statusStats = await Job.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 2. Group by year and month.
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

    // 3. Total applications (all jobs).
    const totalJobsResult = await Job.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalJobs: { $sum: 1 } } }
    ]);
    const totalApplications = totalJobsResult.length ? totalJobsResult[0].totalJobs : 0;

    // 4. Count active interviews.
    const activeInterviews = await Job.countDocuments({ user: userId, status: "interview" });

    // 5. Count offers received.
    const offersReceived = await Job.countDocuments({ user: userId, status: "offer" });

    // 6. Count distinct companies.
    const companiesResult = await Job.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$company" } },
      { $group: { _id: null, companyCount: { $sum: 1 } } }
    ]);
    const companies = companiesResult.length ? companiesResult[0].companyCount : 0;

    // 7. Calculate months and average jobs per month.
    const months = trendStats.length;
    const avgJobsPerMonth = months > 0 ? totalApplications / months : 0;

    res.json({
      statusStats,
      trendStats,
      additionalMetrics: {
        totalApplications,
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
};
