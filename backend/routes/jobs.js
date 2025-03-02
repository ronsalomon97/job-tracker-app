import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
} from '../controllers/jobController.js';

const router = express.Router();

// Advanced Analytics Route
router.get('/stats', authMiddleware, getJobStats);

// Other job routes
router.post('/', authMiddleware, createJob);
router.get('/', authMiddleware, getJobs);
router.get('/:id', authMiddleware, getJobById);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;
