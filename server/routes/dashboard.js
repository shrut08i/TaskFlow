const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const activeCheck = require('../middleware/activeCheck');

const router = express.Router();

router.use(auth, activeCheck);

router.get('/', async (req, res) => {
  try {
    let allTasks;
    let visibleProjectIds;

    if (req.user.role === 'admin') {
      const projects = await Project.find().select('_id');
      visibleProjectIds = projects.map((p) => p._id);
      allTasks = await Task.find({ project: { $in: visibleProjectIds } })
        .populate('assignee', 'name email')
        .populate('project', 'name')
        .sort({ dueDate: 1 });
    } else {
      const memberProjects = await Project.find({ members: req.user._id }).select('_id');
      const memberProjectIds = memberProjects.map((p) => p._id);

      allTasks = await Task.find({
        $or: [
          { project: { $in: memberProjectIds } },
          { assignee: req.user._id },
        ],
      })
        .populate('assignee', 'name email')
        .populate('project', 'name')
        .sort({ dueDate: 1 });
    }

    const now = new Date();

    const stats = {
      totalTasks: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'todo').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      done: allTasks.filter((t) => t.status === 'done').length,
      overdue: allTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
      ).length,
      totalProjects: req.user.role === 'admin'
        ? visibleProjectIds.length
        : new Set(
            allTasks.map((t) => t.project?._id?.toString()).filter(Boolean)
          ).size,
    };

    const overdueTasks = allTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done')
      .slice(0, 10);

    const recentTasks = allTasks.filter((t) => t.status !== 'done').slice(0, 10);

    res.json({ stats, overdueTasks, recentTasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
