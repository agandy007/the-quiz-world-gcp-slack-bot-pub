const express = require('express');
const app = express();
const debug = require('debug')(__filename.slice(__dirname.length + 1, -3));

const port = 3000;

const routers = require('./src/routers/index');

app.use(routers);

app.listen(port, () => debug(`App listening on port ${port}!`));

module.exports = { app };
