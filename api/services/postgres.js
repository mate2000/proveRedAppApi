const { Pool } = require("pg");

class ServicePostgres {
  constructor() {
    this.pool = new Pool({
      user: process.env.USER_DB,
      host: process.env.HOST_DB,
      database: process.env.DB,
      password: process.env.PASSWORD_DB,
      port: process.env.PORT_DB,
    });
  }

  async execute(sql, values) {
    if (values) {
      return await this.pool.query(sql, values);
    } else {
      return await this.pool.query(sql);
    }
  }
}

module.exports = ServicePostgres;
