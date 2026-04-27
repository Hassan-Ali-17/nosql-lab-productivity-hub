// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 20 tasks (with embedded subtasks and tags arrays)
//    - 10 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('users').deleteMany({});

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const now = Date.now();
  const daysAgo = days => new Date(now - days * 24 * 60 * 60 * 1000);

  const aliceHash = await bcrypt.hash('password123', 10);
  const bobHash = await bcrypt.hash('password123', 10);

  const aliceResult = await db.collection('users').insertOne({
    email: 'alice@example.com',
    passwordHash: aliceHash,
    name: 'Alice Chen',
    createdAt: daysAgo(30)
  });
  const bobResult = await db.collection('users').insertOne({
    email: 'bob@example.com',
    passwordHash: bobHash,
    name: 'Bob Martinez',
    createdAt: daysAgo(28)
  });

  const aliceId = aliceResult.insertedId;
  const bobId = bobResult.insertedId;

  const projects = await db.collection('projects').insertMany([
    {
      ownerId: aliceId,
      name: 'Final Year Project',
      description: 'Research, write-up, and final presentation work.',
      archived: false,
      createdAt: daysAgo(26)
    },
    {
      ownerId: aliceId,
      name: 'Study Planner',
      description: 'Weekly planning and revision tracker.',
      archived: false,
      createdAt: daysAgo(20)
    },
    {
      ownerId: bobId,
      name: 'Client Website Redesign',
      description: 'Homepage refresh and content cleanup.',
      archived: false,
      createdAt: daysAgo(24)
    },
    {
      ownerId: bobId,
      name: 'Personal Learning Notes',
      description: 'Small experiments and notes from practice sessions.',
      archived: false,
      createdAt: daysAgo(18)
    }
  ]);

  const projectIds = Object.values(projects.insertedIds);
  const [aliceProjectA, aliceProjectB, bobProjectA, bobProjectB] = projectIds;

  const taskTemplates = [
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Draft thesis outline',
      status: 'todo',
      priority: 5,
      tags: ['writing', 'planning'],
      subtasks: [
        { title: 'Collect references', done: true },
        { title: 'List section headings', done: false }
      ],
      dueDate: daysAgo(-5)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Write literature review',
      status: 'in-progress',
      priority: 4,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Summarize papers', done: false },
        { title: 'Compare approaches', done: false }
      ]
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Prepare slides',
      status: 'done',
      priority: 3,
      tags: ['presentation'],
      subtasks: [
        { title: 'Choose theme', done: true },
        { title: 'Add charts', done: true }
      ],
      dueDate: daysAgo(-2)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Practice presentation',
      status: 'todo',
      priority: 2,
      tags: ['presentation', 'practice'],
      subtasks: [
        { title: 'Time the talk', done: false }
      ]
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Collect supervisor feedback',
      status: 'done',
      priority: 4,
      tags: ['communication'],
      subtasks: [],
      dueDate: daysAgo(-1)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Plan weekly study blocks',
      status: 'todo',
      priority: 3,
      tags: ['planning'],
      subtasks: [
        { title: 'Pick subjects', done: false },
        { title: 'Reserve time slots', done: false }
      ]
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Revise MongoDB joins',
      status: 'in-progress',
      priority: 5,
      tags: ['database', 'study'],
      subtasks: [
        { title: 'Review $lookup', done: true },
        { title: 'Write practice queries', done: false }
      ],
      dueDate: daysAgo(-3)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Summarize lecture notes',
      status: 'done',
      priority: 2,
      tags: ['notes'],
      subtasks: []
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Prepare quiz questions',
      status: 'todo',
      priority: 1,
      tags: ['practice'],
      subtasks: [
        { title: 'Pick topics', done: false }
      ]
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Review class announcements',
      status: 'done',
      priority: 1,
      tags: ['admin'],
      subtasks: []
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Write homepage copy',
      status: 'in-progress',
      priority: 5,
      tags: ['copywriting', 'client'],
      subtasks: [
        { title: 'Draft hero section', done: true },
        { title: 'Polish call to action', done: false }
      ],
      dueDate: daysAgo(-4)
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Update navigation links',
      status: 'todo',
      priority: 3,
      tags: ['frontend'],
      subtasks: [
        { title: 'Check header menu', done: false }
      ]
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Optimize images',
      status: 'done',
      priority: 2,
      tags: ['performance'],
      subtasks: [
        { title: 'Compress hero image', done: true }
      ]
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Fix footer layout',
      status: 'todo',
      priority: 4,
      tags: ['css', 'client'],
      subtasks: [
        { title: 'Align columns', done: false },
        { title: 'Check mobile spacing', done: false }
      ]
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Review responsive breakpoints',
      status: 'in-progress',
      priority: 3,
      tags: ['frontend', 'qa'],
      subtasks: []
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Capture learning notes',
      status: 'todo',
      priority: 2,
      tags: ['notes'],
      subtasks: [
        { title: 'Summarize article', done: false }
      ]
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Experiment with aggregation',
      status: 'done',
      priority: 4,
      tags: ['mongodb', 'aggregation'],
      subtasks: [
        { title: 'Try group stage', done: true },
        { title: 'Try lookup stage', done: true }
      ],
      dueDate: daysAgo(-6)
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Document useful snippets',
      status: 'in-progress',
      priority: 3,
      tags: ['reference'],
      subtasks: []
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Clean up old examples',
      status: 'todo',
      priority: 1,
      tags: ['maintenance'],
      subtasks: [
        { title: 'Remove duplicates', done: false }
      ]
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Prepare next practice set',
      status: 'done',
      priority: 2,
      tags: ['practice'],
      subtasks: [
        { title: 'List topics', done: true }
      ]
    }
  ];

  await db.collection('tasks').insertMany(
    taskTemplates.map((task, index) => ({
      ...task,
      createdAt: daysAgo(17 - index)
    }))
  );

  const notes = [
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Supervisor meeting notes',
      body: 'Focus on the methodology chapter and tighten the timeline.',
      tags: ['meeting', 'writing'],
      createdAt: daysAgo(14)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectB,
      title: 'Revision reminders',
      body: 'Review joins, aggregation, and indexing before the lab.',
      tags: ['study', 'lab'],
      createdAt: daysAgo(12)
    },
    {
      ownerId: aliceId,
      title: 'Standalone idea',
      body: 'Try a lighter dashboard summary card layout next week.',
      tags: ['ideas'],
      createdAt: daysAgo(11)
    },
    {
      ownerId: aliceId,
      title: 'Book list',
      body: 'Collect three useful references from the library catalog.',
      tags: ['research'],
      createdAt: daysAgo(9)
    },
    {
      ownerId: aliceId,
      projectId: aliceProjectA,
      title: 'Presentation checklist',
      body: 'Test slides, notes, and backup PDF before the defense.',
      tags: ['presentation', 'checklist'],
      createdAt: daysAgo(8)
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Client feedback summary',
      body: 'They want a stronger hero section and clearer navigation labels.',
      tags: ['client', 'design'],
      createdAt: daysAgo(13)
    },
    {
      ownerId: bobId,
      projectId: bobProjectB,
      title: 'Aggregation example',
      body: 'Keep the $lookup pipeline grouped by project for the dashboard.',
      tags: ['mongodb', 'aggregation'],
      createdAt: daysAgo(10)
    },
    {
      ownerId: bobId,
      title: 'Quick reminder',
      body: 'Back up notes before cleaning the collection again.',
      tags: ['reminder'],
      createdAt: daysAgo(7)
    },
    {
      ownerId: bobId,
      projectId: bobProjectA,
      title: 'Deployment checklist',
      body: 'Confirm build output, environment variables, and screenshots.',
      tags: ['deploy', 'checklist'],
      createdAt: daysAgo(6)
    },
    {
      ownerId: bobId,
      title: 'Study snippet',
      body: 'MongoDB references are useful when documents must stay in sync.',
      tags: ['study', 'notes'],
      createdAt: daysAgo(5)
    }
  ];

  await db.collection('notes').insertMany(notes);

  console.log('Seeded 2 users, 4 projects, 20 tasks, and 10 notes.');
  process.exit(0);
})();
