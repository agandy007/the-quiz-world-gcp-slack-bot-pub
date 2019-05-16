const express = require('express');
const app = express();

const port = 3000;

const routers = require('./src/routers/index');

app.use(routers);

app.listen(port, () => console.info(`App listening on port ${port}!`));

module.exports = { app };
