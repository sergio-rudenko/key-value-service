const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const db = require('./queries')
db.prepare()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

/* STAT */
app.get('/kv', db.getCount)
app.get('/kv/:store', db.getKeys)

/* CRUD */
app.post('/kv/:store/:key', db.createRecord)
app.get('/kv/:store/:key', db.getRecord)
app.put('/kv/:store/:key', db.updateRecord)
app.delete('/kv/:store/:key', db.deleteRecord)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
