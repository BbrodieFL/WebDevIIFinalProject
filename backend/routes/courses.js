const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/:userId', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/:id/average', courseController.getCourseAverage);

module.exports = router;