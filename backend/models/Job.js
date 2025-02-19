import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['applied', 'interview', 'rejected', 'offer'],
    default: 'applied'
  },
  dateApplied: { type: Date, required: true },
  notes: { type: String },
  //Associates each job with a User (using the ObjectId reference):
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('Job', JobSchema);


