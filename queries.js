const Pool = require('pg').Pool
const pool = new Pool({
	user: 'kv_app',
	host: 'localhost',
	database: 'kv_app_data',
	password: '2wsxZAQ!',
	port: 5432,
})

const getCount = (request, response) => {
	pool.query(
		'SELECT topic, COUNT(topic) FROM data GROUP BY topic ORDER BY topic ASC',
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows)
		}
	)
}

const getKeys = (request, response) => {
	const t = request.params.topic
	pool.query(
		'SELECT key, created_ts, updated_ts FROM data WHERE topic = $1 ORDER BY key ASC', [t],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows)
		}
	)
}

const getRecord = (request, response) => {
	const t = request.params.topic
	const k = request.params.key
	pool.query(
		'SELECT value FROM data WHERE topic = $1 AND key = $2', [t, k],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response.status(409).send(`Record '${t}/${k}' not found!`)
				return console.log(`Record '${t}/${k}' not found!`)
			}
			response.status(200).send(results.rows[0].value)
		}
	)
}

const createRecord = (request, response) => {
	const ts = Math.floor(Date.now() / 1000) | 0
	const { topic, key, value } = request.body
	pool.query(
		'INSERT INTO data (topic, key, value, created_ts, updated_ts) \
     	 VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))', [topic, key, value, ts, ts],
		(error, results) => {
			if (error) {
				response.status(409).send(error.detail)
				return console.log(`Record '${topic}/${key}' already exists!`)
			}
			response.status(201).send(`Created, TS: ${ts}`)
		}
	)
}

const updateRecord = (request, response) => {
	const ts = Math.floor(Date.now() / 1000) | 0
	const t = request.params.topic
	const k = request.params.key
	const { value } = request.body
	pool.query(
		'UPDATE data SET value = $1, updated_ts = to_timestamp($2) \
     	 WHERE topic = $3 AND key = $4', [value, ts, t, k],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response.status(409).send(`Record '${t}/${k}' not found!`)
				return console.log(`Record '${t}/${k}' not found!`)
			}
			response.status(200).send(`Updated, TS: ${ts}`)
		}
	)
}

const deleteRecord = (request, response) => {
	const t = request.params.topic
	const k = request.params.key
	pool.query(
		'DELETE FROM data WHERE topic = $1 AND key = $2', [t, k],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response.status(409).send(`Record '${t}/${k}' not found!`)
				return console.log(`Record '${t}/${k}' not found!`)
			}
			response.status(200).send(`Deleted`)
		}
	)
}

module.exports = {
	getCount,
	getKeys,
	getRecord,
	createRecord,
	updateRecord,
	deleteRecord,
}
