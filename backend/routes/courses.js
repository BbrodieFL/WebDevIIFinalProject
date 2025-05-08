const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');  // Add auth middleware

// Protected routes
router.post('/', auth, courseController.createCourse);
router.get('/:userId', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;