const {Pool} = require('pg')

const pool = new Pool({
  user: 'user1',
  host: 'localhost',
  database: 'mydb',
  password: 'user1',
  port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
  //console.log(err, res)
  pool.end()
})