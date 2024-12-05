const mssql = require("mssql");
const { configMSQL } = require("../config");
class Database {
  constructor() {
    this.connect();
  }
  async connect(type = "SQL_SERVER") {
    const con = await mssql.connect(configMSQL);
    if (con) console.log("Connected to SQL Server");
  }
  static getDatabase() {
    if (!this.database) {
      this.database = new Database();
    }
    return this.database;
  }
}
const db = Database.getDatabase();

module.exports = db;
