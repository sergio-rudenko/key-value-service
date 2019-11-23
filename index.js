const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const db = require('./queries')

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
app.get('/kv/:topic', db.getKeys)
/* CRUD */
app.get('/kv/:topic/:key', db.getRecord)
app.post('/kv/:topic', db.createRecord)
app.put('/kv/:topic/:key', db.updateRecord)
app.delete('/kv/:topic/:key', db.deleteRecord)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
