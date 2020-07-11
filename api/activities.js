const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, createActivity, updateActivity } = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});

activitiesRouter.get("/", async (req, res) => {
  const activities = await getAllActivities();

  res.send({
    activities,
  });
});

activitiesRouter.get("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const activities = await createActivity({ name, description });

  res.send({
    activities,
  });
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const { activityId } = req.params;
  const activities = await updateActivity({ activityId, name, description });

  res.send({
    activities,
  });
});

activitiesRouter.get("/", requireUser, async (req, res, next) => {
  const { activityId } = req.body;
  const activities = await getPublicRoutinesByActivity({ activityId });

  res.send({
    activities,
  });
});

// async function createActivity({ name, description }) {
//     const insertName = name.toLowerCase();
//     try {
//       const {
//         rows: [Activity],
//       } = await client.query(
//         `
//           INSERT INTO activities(name, description)
//           VALUES($1, $2)
//         `,
//         [insertName, description]
//       );

//       return Activity;
//     } catch (error) {
//       throw error;
//     }
//   }

module.exports = activitiesRouter;

// /Users/matthewowen/Desktop/curriculum/FitnessTrac.kr/api/activities.js:11
// usersRouter.get("/", async (req, res) => {
// ^
