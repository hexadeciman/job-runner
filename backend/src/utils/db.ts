import { dbConfig } from "../config/db";

const mysql = require("mysql2/promise");

const emptyOrRows = (rows) => (!rows ? [] : rows);

async function execute(sql, params) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(sql, params);
    connection.end();
    return results;
  } catch(e) {
    console.log("err", e)
    return false;
  }
}

export async function executeMultiple(sql, values) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const data = await connection.query(sql, [values]);
    const [results] = data;
    connection.end();
    return results;
  } catch(e) {
    console.log("err", e)
    return false;
  }
}

export async function queryDB(querystr, params = []) {
  const rows = await execute(querystr, params);
  const data = emptyOrRows(rows);
  return {
    data,
  };
}

export async function insertValues(querystr, params = []) {
  const rows = await executeMultiple(querystr, params);
  const data = emptyOrRows(rows);
  return {
    data,
  };
}
