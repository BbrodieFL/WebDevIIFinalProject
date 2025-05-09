const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// Get all courses for a user
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.params.userId })
      .populate('assignments');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('assignments');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the createCourse function
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId; // Get userId from auth token

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = new Course({
      name,
      description,
      userId
    });

    const newCourse = await course.save();

    // Add course to user's courses array
    await User.findByIdAndUpdate(userId, {
      $push: { courses: newCourse._id }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { name } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (name) course.name = name;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all assignments associated with the course
    await Assignment.deleteMany({ courseId: course._id });
    
    // Remove course from user's courses array
    await User.findByIdAndUpdate(course.userId, {
      $pull: { courses: course._id }
    });
    
    // Use findByIdAndDelete instead of remove()
    await Course.findByIdAndDelete(course._id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error); // Add logging
    res.status(500).json({ message: error.message });
  }
};

// Get course average grade
exports.getCourseAverage = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('assignments');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignments = course.assignments;
    const gradedAssignments = assignments.filter(a => a.grade !== null);
    
    if (gradedAssignments.length === 0) {
      return res.json({ average: null, message: 'No graded assignments' });
    }

    const average = gradedAssignments.reduce((acc, curr) => acc + curr.grade, 0) / 
                   gradedAssignments.length;

    res.json({ average: average.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 