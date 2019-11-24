const Pool = require('pg').Pool
const pool = new Pool({
	user: 'kv_app',
	host: 'localhost',
	database: 'kv_app_data',
	password: '2wsxZAQ!',
	port: 5432,
})

const prepare = () => {
	pool.query(
		'CREATE TABLE IF NOT EXISTS data ( 	\
			store VARCHAR(64) NOT NULL, 	\
			key VARCHAR(256) NOT NULL,		\
			value VARCHAR(2048) NOT NULL,	\
			created_ts TIMESTAMP,			\
			updated_ts TIMESTAMP,			\
		PRIMARY KEY(store, key))', (error, results) => {
		if (error) {
			throw error
		}
		// console.log(results);
	}
	)
}

//app.get('/kv', db.getCount)
const getCount = (request, response) => {
	pool.query(
		'SELECT store, COUNT(store) FROM data GROUP BY store ORDER BY store ASC',
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows)
		}
	)
}

//app.get('/kv/:store', db.getKeys)
const getKeys = (request, response) => {
	const store = request.params.store
	pool.query(
		'SELECT key, created_ts, updated_ts FROM data WHERE store = $1 ORDER BY key ASC', [store],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows)
		}
	)
}

const getRecord = (request, response) => {
	const store = request.params.store
	const key = request.params.key
	pool.query(
		'SELECT value FROM data WHERE store = $1 AND key = $2', [store, key],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response
					.status(404)
					.json({ result: 'error', detail: 'not found' })

				return
			}
			response.status(200).send(results.rows[0].value)
		}
	)
}

const createRecord = (request, response) => {
	const ts = Math.floor(Date.now() / 1000) | 0
	const store = request.params.store
	const key = request.params.key
	const { value } = request.body
	pool.query(
		'INSERT INTO data (store, key, value, created_ts, updated_ts) \
     	 VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))', [store, key, value, ts, ts],
		(error, results) => {
			if (error) {
				response
					.status(409)
					.json({ result: 'error', detail: error.detail })

				return //console.log(`Creating '${store}/${key}' failed, '${error.detail}'`)
			}
			response
				.status(201)
				.json({ result: 'created', ts: ts })
		}
	)
}

const updateRecord = (request, response) => {
	const ts = Math.floor(Date.now() / 1000) | 0
	const store = request.params.store
	const key = request.params.key
	const { value } = request.body
	pool.query(
		'UPDATE data SET value = $1, updated_ts = to_timestamp($2) \
     	 WHERE store = $3 AND key = $4', [value, ts, store, key],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response
					.status(404)
					.json({ result: 'error', detail: 'not found' })

				return
			}
			response
				.status(200)
				.json({ result: 'updated', ts: ts })
		}
	)
}

const deleteRecord = (request, response) => {
	const store = request.params.store
	const key = request.params.key
	pool.query(
		'DELETE FROM data WHERE store = $1 AND key = $2', [store, key],
		(error, results) => {
			if (error) {
				throw error
			}
			if (results.rowCount == 0) {
				response
					.status(404)
					.json({ result: 'error', detail: 'not found' })

				return;
			}
			response
			.status(200)
			.json({ result: 'deleted' })
		}
	)
}

module.exports = {
	prepare,
	getCount,
	getKeys,
	getRecord,
	createRecord,
	updateRecord,
	deleteRecord,
}
