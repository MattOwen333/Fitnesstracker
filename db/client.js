const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/FitnessTrac.kr-dev");

module.exports = { client };
