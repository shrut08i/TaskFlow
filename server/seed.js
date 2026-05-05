const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      isActive: true,
    });

    const member1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@test.com',
      password: 'password123',
      role: 'member',
      isActive: true,
    });

    const member2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@test.com',
      password: 'password123',
      role: 'member',
      isActive: true,
    });

    console.log('Created users');

    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern UI',
      owner: admin._id,
      members: [admin._id, member1._id, member2._id],
    });

    const project2 = await Project.create({
      name: 'Mobile App MVP',
      description: 'Build the first version of our mobile application',
      owner: admin._id,
      members: [admin._id, member1._id],
    });

    console.log('Created projects');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    await Task.create([
      {
        title: 'Design homepage mockup',
        description: 'Create wireframes and high-fidelity mockups for the new homepage',
        project: project1._id,
        assignee: member1._id,
        createdBy: admin._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: nextWeek,
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        project: project1._id,
        assignee: member2._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'medium',
        dueDate: nextMonth,
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints with request/response examples',
        project: project1._id,
        assignee: member1._id,
        createdBy: admin._id,
        status: 'done',
        priority: 'low',
        dueDate: yesterday,
      },
      {
        title: 'Fix navigation bug',
        description: 'Mobile menu not closing after selecting a link',
        project: project1._id,
        assignee: member2._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'high',
        dueDate: yesterday,
      },
      {
        title: 'Design app login screen',
        description: 'Create the login and signup UI for the mobile app',
        project: project2._id,
        assignee: member1._id,
        createdBy: admin._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: nextWeek,
      },
      {
        title: 'Setup React Native project',
        description: 'Initialize the project with Expo and configure navigation',
        project: project2._id,
        assignee: member1._id,
        createdBy: admin._id,
        status: 'done',
        priority: 'medium',
        dueDate: yesterday,
      },
    ]);

    console.log('Created tasks');
    console.log('\n--- Seed Complete ---');
    console.log('Admin:  admin@test.com / password123');
    console.log('Member: alice@test.com / password123');
    console.log('Member: bob@test.com   / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
