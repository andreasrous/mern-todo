const asyncHandler = require('express-async-handler');

const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
});

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const setTask = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add a text field');
    }

    const task = await Task.create({
        text: req.body.text,
        user: req.user.id
    });

    res.status(200).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    const user = await User.findById(req.user.id);

    // check for user
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // make sure the logged in user matches the task user
    if (task.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    const user = await User.findById(req.user.id);

    // check for user
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // make sure the logged in user matches the task user
    if (task.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedTask);
});

module.exports = {
    getTasks,
    setTask,
    updateTask,
    deleteTask
};