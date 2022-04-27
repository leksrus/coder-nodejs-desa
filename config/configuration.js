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
    filename: "./db/chats.sqlite"
  }
});

export default { mySqlDatabase, sqlLite3Database };