require("dotenv").config();

module.exports = {
  development: {
    username: process.env.mysql_user,
    password: process.env.mysql_pass,
    database: process.env.mysql_db,
    host: process.env.mysql_host,
    dialect: "mysql",
  },
  production: {
    username: process.env.mysql_user,
    password: process.env.mysql_pass,
    database: process.env.mysql_db,
    host: process.env.mysql_host,
    dialect: "mysql",
  },
};
