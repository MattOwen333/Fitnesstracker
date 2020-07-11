const {
  getAllUsers,
  createUser,
  updateActivity,
  createActivity,
  getAllActivities,
  createRoutine,
} = require("./index");

const { client } = require("./client");

// async function testDB() {
//   try {
//     console.log("Starting to test database...");

//     const users = await getAllUsers();
//     console.log("getAllUsers:", users);

//     console.log("Finished database tests!");
//   } catch (error) {
//     console.error("Error testing database!");
//     throw error;
//   }
// }

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS users;
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
);
    CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
);
    CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER references users(id),
        public BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
);
    CREATE TABLE routine_activities (
        id SERIAL PRIMARY KEY,
        "routineId" INTEGER references routines(id),
        "activityId" INTEGER references activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE ("routineId", "activityId")
);
        `);
    //async function addActivityToRoutine({ routineId, activityId, count, duration })
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialActivities() {
  try {
    console.log("Starting to create activities...");

    await createActivity({
      name: "Upright Rows",
      description: "Bring the bar to your chest",
    });
    await createActivity({
      name: "Dumbell Romanian DeadLift",
      description: "Keep your back straight and lower the  weight to the floor",
    });
    await createActivity({
      name: "Thrusters",
      description: "Bend into a squat and Thrust the weight above your head",
    });

    console.log("Finished creating activities!");
  } catch (error) {
    console.error("Error creating activities!");
    throw error;
  }
}

async function createInitialroutines() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createRoutine({
      creatorId: albert.id,
      public: true,
      name: "Strength Training",
      goal: "Build all over strength",
    });

    await createRoutine({
      creatorId: sandra.id,
      public: false,
      name: "Pilates",
      goal: "Build core strength",
    });

    await createRoutine({
      creatorId: glamgal.id,
      public: true,
      name: "Yoga",
      goal: "Build longevity",
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialroutines();
    // testDB();
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDB();
