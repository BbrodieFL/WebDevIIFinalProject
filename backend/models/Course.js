const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    default: '',
    trim: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Course', CourseSchema);