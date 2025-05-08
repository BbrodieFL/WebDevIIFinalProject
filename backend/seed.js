const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gradetrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });

    // Create some courses
    const course1 = await Course.create({
      userId: user._id,
      name: 'Web Development II'
    });

    const course2 = await Course.create({
      userId: user._id,
      name: 'Database Systems'
    });

    // Create some assignments
    const assignments = await Assignment.create([
      {
        courseId: course1._id,
        title: 'Final Project',
        dueDate: new Date('2024-05-15'),
        grade: 95
      },
      {
        courseId: course1._id,
        title: 'Midterm Exam',
        dueDate: new Date('2024-03-15'),
        grade: 88
      },
      {
        courseId: course2._id,
        title: 'Database Design',
        dueDate: new Date('2024-04-01'),
        grade: 92
      }
    ]);

    // Update courses with assignments
    await Course.findByIdAndUpdate(course1._id, {
      assignments: [assignments[0]._id, assignments[1]._id]
    });

    await Course.findByIdAndUpdate(course2._id, {
      assignments: [assignments[2]._id]
    });

    // Update user with courses
    await User.findByIdAndUpdate(user._id, {
      courses: [course1._id, course2._id]
    });

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 