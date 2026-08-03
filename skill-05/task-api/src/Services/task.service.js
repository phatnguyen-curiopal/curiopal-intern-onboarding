const pool = require("../db");

// POST /tasks
async function createTask(task) {
  const [result] = await pool.execute(
    `
            INSERT INTO tasks(title, description, status)
            VALUES (?, ?, ?)
        `,
    [task.title, task.description, task.status],
  );

  return getTaskById(result.insertId);
}

//GET /tasks (with ?status= filter and ?page= pagination)
async function getTasks(status, limit, offset) {
  let sql = `
        SELECT id, title, description, status
        FROM tasks
    `;
  const values = [];
  if (status) {
    sql += `WHERE status = ?`;
    values.push(status);
  }

  sql += `
        ORDER BY id DESC 
        LIMIT ?
        OFFSET ? 
    `;
  values.push(limit, offset);

  const [rows] = await pool.execute(sql, offset);

  return rows;
}

//GET /tasks/:id
async function getTaskById(id) {
  const [result] = pool.execute(
    `
        SELECT id, title, description, status
        FROM tasks
        WHERE id = ?
    `,
    [id],
  );

  return result;
}

//PATCH /tasks/:id
async function patchTask(id, updates) {
  const fields = [];
  const values = [];

  if (updates.title) {
    fields.push(`title = ?`);
    values.push(updates.title);
  }

  if (updates.description) {
    fields.push(`description = ?`);
    values.push(updates.description);
  }

  if (updates.status) {
    fields.push(`status = ?`);
    values.push(updates.status);
  }

  values.push(id);

  const [result] = pool.execute(
    `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE id = ?
    `,
    values,
  );

  return getTaskById(id);
}

//DELETE /tasks/:id
async function deleteTask(id) {
  const [result] = await pool.execute(
    `
        DELETE FROM tasks WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  patchTask,
  deleteTask,
};
