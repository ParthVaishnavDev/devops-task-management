const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 */
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 */
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Task deleted successfully',
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
