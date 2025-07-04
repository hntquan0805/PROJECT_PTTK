import sql from 'mssql';

const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'localhost',
  port: 1433,  
  database: 'your_database',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connecting to SQL Server successfully!');
    return pool;
  })
  .catch(err => {
    console.error('Error when connecting to SQL Serve!', err);
  });

module.exports = {
  sql, poolPromise
};
