const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Parse JSON request bodies
app.use(express.json());
console.log("HI")

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// 404 and centralized error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
