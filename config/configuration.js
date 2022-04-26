import knex from 'knex'


export const mySqlDatabase = knex({
  client: 'mysql2',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'admin',
    database : 'CODERDESA'
  }
});


export const sqlLite3Database = knex({
  client: 'sqlite3',
  connection: {
    host : 'localhost',
    user : '',
    password : 'your_database_password',
    database : 'myapp_test'
  }
});

export default { mySqlDatabase, sqlLite3Database };