// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it

// updateRoutineActivity({ id, count, duration })
// Find the routine with id equal to the passed in id
// Update the count or duration as necessary

// destroyRoutineActivity(id)
// remove routine_activity from database

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId", "activityId", count, duration )
        VALUES($1, $2, $3, $4) 
        ON CONFLICT ("routineId", "activityId") DO NOTHING 
        RETURNING *;

      `,
      [routineId, activityId, count, duration]
    );

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

//update routine

async function updateRoutineActivity({ id, count, duration }) {
  const updateFields = {};

  if (count) {
    updateFields.count = count;
  }
  if (duration) {
    updateFields.duration = duration;
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
            UPDATE routine_activities
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

async function destroyRoutineActivity(id) {
  try {
    await client.query(
      `
          DELETE FROM routine_activities
          WHERE routine_activities.id = ${id}
        `
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
};

// destroyRoutineActivity(id)
// remove routine_activity from database

// `
// DELETE FROM post_tags
// WHERE "tagId"
// NOT IN (${tagListIdString})
// AND "postId"=$1;
// `,
