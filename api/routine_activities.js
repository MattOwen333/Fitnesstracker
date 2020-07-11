const { requireUser } = require("./utils");
const express = require("express");
const routinesRouter = express.Router();
const { updateRoutineActivity } = require("../db");

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { count, duration } = req.body;
  const { routineId: id } = req.params;

  // await getRoutineById and then use next?

  const updatedRoutineActivity = await updateRoutineActivity({
    id,
    count,
    duration,
  });

  res.send({
    updatedRoutineActivity,
  });
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const post = await getRoutineById(req.params.routineId);

    if (routine && routine.author.id === req.user.id) {
      const updatedRoutineActivity = await destroyRoutineActivity(post.id, {
        active: false,
      });

      res.send({ post: updatedRoutineActivity });
    } else {
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot edit a routine which is not yours",
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

// async function destroyRoutineActivity(id) {
//     try {
//       await client.query(
//         `
//             DELETE FROM routine_activities
//             WHERE routine_activities.id = ${id}
//           `
//       );
//     } catch (error) {
//       throw error;
//     }
//   }

//   module.exports = {
//     addActivityToRoutine,
//     updateRoutineActivity,
//     destroyRoutineActivity,
//   };

// routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
//     const { public, name, goal } = req.body;
//     const { routineId: id } = req.params;

//     // await getRoutineById and then use next?

//     const routine = await updateRoutine({ id, public, name, goal });

//     res.send({
//       routine,
//     });
//   });

// async function updateRoutine({ id, public, name, goal }) {
//     const updateFields = {};
//     if (typeof public !== "undefined") {
//       updateFields.public = public;
//     }

//     if (name) {
//       updateFields.name = name;
//     }
//     if (goal) {
//       updateFields.goal = goal;
//     }

//     const setString = Object.keys(updateFields)
//       .map((key, index) => `"${key}"=$${index + 1}`)
//       .join(", ");

//     if (setString.length === 0) {
//       return;
//     }

//     try {
//       const result = await client.query(
//         `
//             UPDATE routines
//             SET ${setString}
//             WHERE id = ${id}
//             RETURNING *;
//           `,
//         Object.values(updateFields)
//       );

//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function destroyRoutine(id) {
//     try {
//       await client.query(`
//             DELETE FROM routines
//             WHERE id = ${id}
//             );
//       `);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function updateRoutineActivity({ id, count, duration }) {
//     const updateFields = {};

//     if (count) {
//       updateFields.count = count;
//     }
//     if (duration) {
//       updateFields.duration = duration;
//     }

//     const setString = Object.keys(updateFields)
//       .map((key, index) => `"${key}"=$${index + 1}`)
//       .join(", ");

//     if (setString.length === 0) {
//       return;
//     }

//     try {
//       const result = await client.query(
//         `
//               UPDATE routine_activities
//               SET ${setString}
//               WHERE id = ${id}
//               RETURNING *;
//             `,
//         Object.values(updateFields)
//       );

//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }
