const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// Get all assignments for a course
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId })
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, dueDate, courseId } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignment = new Assignment({
      title,
      dueDate,
      courseId
    });

    const newAssignment = await assignment.save();

    // Add assignment to course's assignments array
    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: newAssignment._id }
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { title, dueDate, grade } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (title) assignment.title = title;
    if (dueDate) assignment.dueDate = dueDate;
    if (grade !== undefined) {
      if (grade < 0 || grade > 100) {
        return res.status(400).json({ message: 'Grade must be between 0 and 100' });
      }
      assignment.grade = grade;
    }

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Remove assignment from course's assignments array
    await Course.findByIdAndUpdate(assignment.courseId, {
      $pull: { assignments: assignment._id }
    });
    
    // Delete the assignment
    await assignment.remove();
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update assignment grade
exports.updateGrade = async (req, res) => {
  try {
    const { grade } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (grade < 0 || grade > 100) {
      return res.status(400).json({ message: 'Grade must be between 0 and 100' });
    }

    assignment.grade = grade;
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 