// config for sql server
const configSQLServer = {
  server: process.env.SERVER,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PASSWORD,
  options: {
    trustedConnection: true, // Set to true if using Windows Authentication
    trustServerCertificate: true, // Set to true if using self-signed certificates
    enableArithAbort: true,
  },
};
module.exports = {
  configMSQL: configSQLServer,
};
