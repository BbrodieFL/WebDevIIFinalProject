const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/:courseId', assignmentController.getAssignments);
router.get('/:id', assignmentController.getAssignment);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);
router.put('/:id/grade', assignmentController.updateGrade);

module.exports = router;