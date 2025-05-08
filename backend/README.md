# GradeTrack Backend

This is the backend server for the GradeTrack application, a student assignment tracking system.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
  ```bash
  # Install MongoDB on Mac using Homebrew
  brew tap mongodb/brew
  brew install mongodb-community
  
  # Start MongoDB service
  brew services start mongodb-community
  
  # Verify MongoDB is running
  mongosh
  ```
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install express mongoose cors dotenv bcryptjs jsonwebtoken
   ```
4. Make sure MongoDB is running on your system

5. Create a `.env` file in the backend directory with the following content:
   ```properties
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/gradetrack
   JWT_SECRET=your_super_secret_key_here   # Replace with a secure random string
   ```

   Note: Never commit your actual JWT_SECRET to version control. Each developer should create their own secure secret key.
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

### Authentication
- POST /api/auth/register - Register new user
  - Required fields: username, email, password
- POST /api/auth/login - Login user
  - Required fields: email, password
  - Returns: JWT token and user details

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

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Protected routes include:
- All /api/courses endpoints
- All /api/assignments endpoints
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id