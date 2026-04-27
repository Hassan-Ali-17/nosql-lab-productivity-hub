# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores one account per person with login credentials and display name.
- **projects** — Stores each user's projects, including a soft-delete/archive flag.
- **tasks** — Stores project work items with status, priority, tags, and embedded subtasks.
- **notes** — Stores personal notes that can optionally belong to a project and can be searched by tags.

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  projectId: ObjectId (required),
  title: string (required),
  status: string (required, one of "todo" | "in-progress" | "done"),
  priority: number (required, default 1),
  tags: string[] (required, default []),
  subtasks: Array<{ title: string, done: boolean }> (required, default []),
  createdAt: Date (required),
  dueDate: Date (optional)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required),
  projectId: ObjectId (optional),
  title: string (required),
  body: string (required),
  tags: string[] (required, default []),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            | Embed               | Subtasks are small, only make sense inside one task, and should be updated with the parent task. |
| Tags on a task                    | Embed               | Tags are just a simple array of strings, so embedding keeps reads and updates simple. |
| Project → Task ownership          | Reference           | Tasks need to point to a project by id so they can be queried and grouped without duplicating project data. |
| Note → optional Project link      | Reference           | A note may belong to a project, but it should still exist independently if that link is absent. |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

`dueDate` appears only on some task documents. This is acceptable because MongoDB collections do not require every document to share exactly the same fields, so optional fields can be added only when they are useful.
