const request = require('supertest');
const app = require('../app');


describe('Testing GET endpoints', () => {
    test('"/" should response 200',
        async () => {
            const response = await request(app)
                .get('/');

            //{"info":"Node.js, Express, and Postgres API","version":"1"}
            expect(response.body.version).toBeDefined();
            expect(response.body.info).toBeDefined();
            expect(response.statusCode).toBe(200);
        }
    );
});

describe('Testing GET endpoints', () => {
    test('"/kv" should response 200',
        async () => {
            const response = await request(app)
                .get('/kv');

            //[{"store":"test","count":"2"}]
            expect(response.body.length).toBe(1);
            expect(response.body[0].store).toBe('test');
            expect(parseInt(response.body[0].count)).toBe(2);
            expect(response.statusCode).toBe(200);
        }
    );
});

describe('Testing GET endpoints', () => {
    test('"/kv/test" should response 200',
        async () => {
            const response = await request(app)
                .get('/kv/test');

            //[{"key":"123","created_ts":"...","updated_ts":"..."},{"key":"456","created_ts":"...","updated_ts":"..."}]
            expect(response.body.length).toBe(2);
            expect(response.body[0].key).toBe('123');
            expect(response.body[0].created_ts).toBeDefined();
            expect(response.body[0].updated_ts).toBeDefined();
            expect(response.body[1].key).toBe('456');
            expect(response.body[1].created_ts).toBeDefined();
            expect(response.body[1].updated_ts).toBeDefined();
            expect(response.statusCode).toBe(200);
        }
    );
});

describe('Testing CRUD', () => {
    test('POST "/kv/sample/ABCDEF"',
        async () => {
            const response = await request(app)
                .post('/kv/sample/ABCDEF')
                .send({
                    value: {
                        name: 'mock name',
                        description: 'mock description'
                    }
                });

            //{"result":"created","ts":1574597904}
            expect(response.body.result).toBe('created');
            expect(response.body.ts).toBeDefined();
            expect(response.statusCode).toEqual(201);
        });
});

describe('Testing CRUD', () => {
    test('POST "/kv/sample/ABCDEF", already exists', async () => {
        const response = await request(app)
            .post('/kv/sample/ABCDEF')
            .send({
                value: {
                    name: 'mock name',
                    description: 'mock description'
                }
            });

        //{"result":"error","detail":"Key (store, key)=(sample, ABCDEF) already exists."}
        expect(response.body.result).toBe('error');
        expect(response.body.detail).toBeDefined();
        expect(response.statusCode).toEqual(409);
    });
});

describe('Testing CRUD', () => {
    test('POST "/kv/sample/111111", empty value', async () => {
        const response = await request(app)
            .post('/kv/sample/111111')
            .send({});

        //{"result":"error","detail":"Failing row contains (sample, 111111, null, 2019-11-24 15:18:45, 2019-11-24 15:18:45)."}            
        expect(response.body.result).toBe('error');
        expect(response.body.detail).toBeDefined();
        expect(response.statusCode).toEqual(409);
    });
});

describe('Testing CRUD', () => {
    test('GET "/kv/sample/ABCDEF"', async () => {
        const response = await request(app)
            .get('/kv/sample/ABCDEF');

        //{"name":"mock name","description":"mock description"}
        expect(response.body).toBeDefined();
        expect(response.statusCode).toBe(200);
    });
});

describe('Testing CRUD', () => {
    test('GET "/kv/sample/111111", does not exists', async () => {
        const response = await request(app)
            .get('/kv/sample/111111');

        //{"result":"error","detail":"not found"}
        expect(response.body.result).toBe('error');
        expect(response.body.detail).toBeDefined();
        expect(response.statusCode).toBe(404);
    });
});

describe('Testing CRUD', () => {
    test('PUT "/kv/sample/ABCDEF"', async () => {
        const response = await request(app)
            .put('/kv/sample/ABCDEF')
            .send({
                value: {
                    name: 'updated name',
                    description: 'updated description'
                }
            });

        //{"result":"updated","ts":1574597904}
        expect(response.body.result).toBe('updated');
        expect(response.body.ts).toBeDefined();
        expect(response.statusCode).toBe(200);
    });
});

describe('Testing CRUD', () => {
    test('PUT "/kv/sample/111111", does not exists', async () => {
        const response = await request(app)
            .put('/kv/sample/111111')
            .send({
                value: {
                    name: 'updated name',
                    description: 'updated description'
                }
            });

        //{"result":"error","detail":"not found"}
        expect(response.body.result).toBe('error');
        expect(response.body.detail).toBeDefined();
        expect(response.statusCode).toBe(404);
    });
});

describe('Testing CRUD', () => {
    test('DELETE "/kv/sample/ABCDEF"', async () => {
        const response = await request(app)
            .delete('/kv/sample/ABCDEF');

        //{"result":"deleted"}
        expect(response.body.result).toBe('deleted');
        expect(response.statusCode).toBe(200);
    });
});

describe('Testing CRUD', () => {
    test('DELETE "/kv/sample/ABCDEF", does not exists', async () => {
        const response = await request(app)
            .delete('/kv/sample/ABCDEF');

        //{"result":"error","detail":"not found"}
        expect(response.body.result).toBe('error');
        expect(response.body.detail).toBeDefined();
        expect(response.statusCode).toBe(404);
    });
});

//test.todo('other CRUD testing');
