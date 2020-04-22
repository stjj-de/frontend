require("dotenv").config();
const path = require("path");

module.exports = {
  migrations: [path.resolve(__dirname, "./server/dist/data/migrations/*.js")],
  entities: [path.resolve(__dirname, "./server/dist/data/models/*.js")],
  cli: {
    migrationsDir: path.resolve(__dirname, "./server/src/data/migrations")
  },
  type: "mysql",
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  port: process.env.MYSQL_PORT,
  timezone: process.env.MYSQL_TIMEZONE
};
