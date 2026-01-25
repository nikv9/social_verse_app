import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.mysql_db,
  process.env.mysql_user,
  process.env.mysql_pass,
  {
    host: process.env.mysql_host,
    dialect: "mysql",
    logging: false,
  }
);

export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL DB connected!");
  } catch (error) {
    console.error("MySQL connection error:", error);
  }
};
