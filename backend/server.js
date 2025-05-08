const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const auth = require('./middleware/auth'); // Assuming you have an auth middleware
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Add this for debugging
console.log('Environment variables loaded:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
});

// Import routes (to be created)
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gradetrack')
.then(() => {
    console.log('Connected to MongoDB');
    // Start server only after successful connection
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch(err => console.error('MongoDB connection error:', err));

// Port normalization
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Error handling
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listeners
server.on('error', errorHandler);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

// Remove this line as we're already starting the server in MongoDB connection callback
// server.listen(port);