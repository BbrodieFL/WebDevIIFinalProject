# GradeTrack Backend

This is the backend server for the GradeTrack application, a student assignment tracking system.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make sure MongoDB is running on your system
5. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/gradetrack
   ```
6. Seed the database (optional):
   ```bash
   npm run seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## API Endpoints

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get single user
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Courses
- GET /api/courses/:userId - Get all courses for a user
- GET /api/courses/:id - Get single course
- POST /api/courses - Create new course
- PUT /api/courses/:id - Update course
- DELETE /api/courses/:id - Delete course
- GET /api/courses/:id/average - Get course average grade

### Assignments
- GET /api/assignments/:courseId - Get all assignments for a course
- GET /api/assignments/:id - Get single assignment
- POST /api/assignments - Create new assignment
- PUT /api/assignments/:id - Update assignment
- DELETE /api/assignments/:id - Delete assignment
- PUT /api/assignments/:id/grade - Update assignment grade 