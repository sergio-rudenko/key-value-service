const app = require('./app');
const HOST = process.env.APP_HOST || '0.0.0.0';
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
