import { Sequelize, Dialect } from "sequelize";
import mysql2 from "mysql2";
import { getConfig } from "../config";

const sequelize: Sequelize = new Sequelize({
  ...getConfig("mysql_config"),
  // dialectModule: mysql2,
  dialect: "mysql" as Dialect,
  logging: (sql, queryObject) => {
    console.log("sql: ", sql);
  },
});

const initMysql = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("MySQL database connection succeeded.");
  } catch (error) {
    console.log(`MySQL database link error: ${error}`);
  }
};

const initDB = async (): Promise<void> => {
  await initMysql();
};

export { sequelize, initDB };
