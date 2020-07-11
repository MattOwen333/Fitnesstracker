const { client } = require("./client");

async function createActivity({ name, description }) {
  const insertName = name.toLowerCase();
  try {
    const {
      rows: [Activity],
    } = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2) 
      `,
      [insertName, description]
    );

    return Activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    // it states to return an array* will this do it or do i need to
    // use a built in method
    const { rows } = await client.query(`
        SELECT * FROM activities
      `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// Ask if this will work || Ask what fields means as an input

async function updateActivity({ activityId, name, description }) {
  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }

  const setString = Object.keys(updateFields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET ${setString}
        WHERE id=${activityId}
        RETURNING *;
      `,
      Object.values(updateFields)
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createActivity,
  getAllActivities,
  updateActivity,
};
