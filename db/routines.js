const { client } = require("./client");

async function getAllRoutines() {
  try {
    // it states to return an array will this do it or do i need to
    // use a built in method || wrap rows in an array
    const { rows } = await client.query(`
        SELECT id
        FROM routines
    `);

    const routines = await Promise.all(
      rows.map((routineIdObj) => getRoutineById(routineIdObj.id))
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutines() {
  try {
    // it states to return an array* will this do it or do i need to
    // use a built in method
    const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE public = true; 
        `); //is this how i do this??

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      SELECT name, goal
      FROM routines
      WHERE "creatorId"=${username}
      );
`); //is this how i do this?? && with the input of username how do
    // determine just the activites from

    // can i just use username.id or do i need to map

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
        SELECT * FROM routine WHERE id=${id};
      `);

    const { rows: activites } = await client.query(`
        SELECT activities.*
        FROM activities 
        JOIN routine_activities ON routine_activities."activityId"=activities.id
        WHERE routine_activities."routineId"=${id}
      `);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
        SELECT routines.id
        FROM routines
        JOIN users ON users.id = routines."creatorId"
        WHERE users.username=${username} AND public = true
        ;
  `);
    return await Promise.all(rows.map((rows) => getRoutineById(rows.id))); //get activities by routine id
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ activityId }) {
  try {
    const { activities } = await client.query(`
      SELECT name, goal
      FROM routines
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      WHERE public = true AND routine_activities."activityId"=${activityId}
      );
`);
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, public, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routine("creatorId", public, name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [creatorId, public, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, public, name, goal }) {
  const updateFields = {};
  if (typeof public !== "undefined") {
    updateFields.public = public;
  }

  if (name) {
    updateFields.name = name;
  }
  if (goal) {
    updateFields.goal = goal;
  }

  const setString = Object.keys(updateFields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const result = await client.query(
      `
          UPDATE routines
          SET ${setString}
          WHERE id = ${id}
          RETURNING *;
        `,
      Object.values(updateFields)
    );

    return result;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(`
          DELETE FROM routines
          WHERE id = ${id}
          );
    `);
  } catch (error) {
    throw error;
  }
}

// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities
// 'whose routine is the one being deleted.

module.exports = {
  getAllRoutines,
  getPublicRoutines,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
