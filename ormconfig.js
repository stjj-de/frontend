require("dotenv").config();
const path = require("path");

module.exports = {
  type: "mysql",
  database: "stjj-de",
  migrations: [path.resolve(__dirname, "./server/dist/data/migrations/*.js")],
  entities: [path.resolve(__dirname, "./server/dist/data/models/*.js")],
  cli: {
    migrationsDir: path.resolve(__dirname, "./server/src/data/migrations")
  },
  host: process.env.TYPEORM_HOST,
  password: process.env.TYPEORM_PASSWORD,
  username: process.env.TYPEORM_USERNAME,
  port: process.env.TYPEORM_PORT,
  synchronize: true,
  timezone: "+00:00"
};
