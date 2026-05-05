const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const activeCheck = require('../middleware/activeCheck');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth, activeCheck);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project is required'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (
        req.user.role !== 'admin' &&
        !project.members.some((m) => m.toString() === req.user._id.toString())
      ) {
        return res.status(403).json({ message: 'You are not a member of this project' });
      }

      const task = await Task.create({
        title: req.body.title,
        description: req.body.description || '',
        project: req.body.project,
        assignee: req.body.assignee || null,
        createdBy: req.user._id,
        status: req.body.status || 'todo',
        priority: req.body.priority || 'medium',
        dueDate: req.body.dueDate || null,
      });

      if (req.body.assignee && task.assignee) {
        const aid = task.assignee.toString();
        const already = project.members.some((m) => m.toString() === aid);
        if (!already) {
          project.members.push(task.assignee);
          await project.save();
        }
      }

      await task.populate('assignee createdBy', 'name email');
      await task.populate('project', 'name');
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    let filter = {};

    if (req.query.project) {
      filter.project = req.query.project;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.assignee) {
      filter.assignee = req.query.assignee;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map((p) => p._id);
      const baseFilter = { ...filter };

      if (req.query.project) {
        const pid = req.query.project;
        const isMember = projectIds.some((id) => id.toString() === pid);
        const clauses = [{ ...baseFilter, assignee: req.user._id }];
        if (isMember) {
          clauses.unshift({ ...baseFilter });
        }
        filter = clauses.length === 1 ? clauses[0] : { $or: clauses };
      } else {
        const clauses = [{ ...baseFilter, assignee: req.user._id }];
        if (projectIds.length > 0) {
          clauses.unshift({ ...baseFilter, project: { $in: projectIds } });
        }
        filter = clauses.length === 1 ? clauses[0] : { $or: clauses };
      }
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'dueDate'];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (updates.assignee !== undefined && task.assignee) {
      const projId = task.project?._id || task.project;
      const projectDoc = await Project.findById(projId);
      if (projectDoc) {
        const aid = task.assignee._id?.toString() || task.assignee.toString();
        if (!projectDoc.members.some((m) => m.toString() === aid)) {
          projectDoc.members.push(task.assignee._id || task.assignee);
          await projectDoc.save();
        }
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Only admins or task creator can delete' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
