const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getAllUsers,
  createUser,
  getUserByUsername,
  getAllRoutines,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users,
  });
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user && user.password == password) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );
      res.send({ message: "you're logged in!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  const SALT_COUNT = 10;
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    bcrypt.hash(password, SALT_COUNT, async function (err, hashedPassword) {
      const user = await createUser({
        username,
        password: hashedPassword,
      });
      res.send({ user });
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.get("/", async (req, res) => {
  const { username } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    await getPublicRoutinesByUser({
      username,
    });

    res.send({
      message: "Here are the users public routines",
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.get("/:username/routines", async (req, res) => {
  const publicUserRoutines = await getPublicRoutinesByUser(req.params);

  res.send({
    publicUserRoutines,
  });
});

//get user by username
// postsRouter.get("/", async (req, res) => {
//   try {
//     const allRoutines = await getAllRoutines();

//     const posts = allRoutines.filter((post) => {
//       return post.active || (req.user && post.author.id === req.user.id);
//     });

//     res.send({
//       posts,
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// async function getPublicRoutinesByUser({ username }) {
//     try {
//       const { rows } = await client.query(`
//           SELECT routines.id
//           FROM routines
//           JOIN users ON users.id = routines."creatorId"
//           WHERE users.username=${username} AND public = true
//           ;
//     `);
//       return await Promise.all(rows.map((rows) => getRoutineById(rows.id))); //get activities by routine id
//     } catch (error) {
//       throw error;
//     }
//   }

module.exports = usersRouter;
