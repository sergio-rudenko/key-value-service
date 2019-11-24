const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const db = require('./queries')
db.prepare()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// sa100@sa100-1215P:~$ curl localhost:3000/; echo
// {"info":"Node.js, Express, and Postgres API"}
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API', version: '1' })
})

/* STAT */
app.get('/kv', db.getCount)
app.get('/kv/:store', db.getKeys)

/* CRUD */
app.post('/kv/:store/:key', db.createRecord)
app.get('/kv/:store/:key', db.getRecord)
app.put('/kv/:store/:key', db.updateRecord)
app.delete('/kv/:store/:key', db.deleteRecord)

// separate app and server for jest testing
module.exports = app

