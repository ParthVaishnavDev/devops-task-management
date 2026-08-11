const express = require('express');

const router = express.Router();

/**
 * @desc    Health check for monitoring / deployment verification
 * @route   GET /api/health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Task Management API is running',
  });
});

module.exports = router;
