const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, assignmentController.createAssignment);
router.get('/:courseId', assignmentController.getAssignments);
router.get('/:id', assignmentController.getAssignment);
router.put('/:id', auth, assignmentController.updateAssignment);
router.delete('/:id', auth, assignmentController.deleteAssignment);

module.exports = router;