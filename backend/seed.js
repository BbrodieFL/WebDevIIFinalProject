const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');

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

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });

    // Create test courses
    const courses = await Course.create([
      {
        name: 'Web Development II',
        instructor: 'John Doe',
        userId: user._id    // Link to user
      },
      {
        name: 'Database Systems',
        instructor: 'Jane Smith',
        userId: user._id    // Link to user
      }
    ]);

    // Update user with course references
    await User.findByIdAndUpdate(user._id, {
      $push: { courses: { $each: courses.map(course => course._id) } }
    });

    console.log('Database seeded with:');
    console.log('- User:', user.email);
    console.log('- Courses:', courses.map(c => c.name).join(', '));

  } catch (error) {
    console.error('Error seeding database:', error);
  }
  process.exit();
};

seedDatabase();