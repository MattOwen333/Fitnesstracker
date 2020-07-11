const express = require("express");
const routinesRouter = express.Router();
const {
  getPublicRoutinesByUser,
  getPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  addActivityToRoutine,
} = require("../db");
const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res) => {
  const publicRoutines = await getPublicRoutines();

  res.send({
    publicRoutines,
  });
});

// POST /routines (*)
// Create a new routine

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { creatorId, public, name, goal } = req.body;
  const routine = await createRoutine({ creatorId, public, name, goal });

  res.send({
    routine,
  });
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { public, name, goal } = req.body;
  const { routineId: id } = req.params;

  // await getRoutineById and then use next?

  const routine = await updateRoutine({ id, public, name, goal });

  res.send({
    routine,
  });
});

/* is this checking if the user is the owner of the object, maybe use
getRoutineById */

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const post = await getRoutineById(req.params.routineId);

    if (routine && routine.author.id === req.user.id) {
      const updatedRoutine = await updateRoutine(post.id, { active: false });

      res.send({ post: updatedRoutine });
    } else {
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /routines/:routineId/activities
// Attach a single activity to a routine.
// Prevent duplication on (routineId, activityId) pair.

/* maybe try getRoutineById then run updateroutine and or updateactivity
 */

routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { activityId, count, duration } = req.body;
    const { routineId } = req.params;

    // await getRoutineById and then use next?

    const routine = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    res.send({
      routine,
    });
  }
);

// run addActivityToRoutine
module.exports = routinesRouter;
