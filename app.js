const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());
app.use(authJwt());


const authRoute = require('./routes/auth');
app.use(`${API}/`,authRoute);

mongoose.connect(env.MOONGO_CONNECTION_STRING).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});

const hostname = env.HOSTNAME;
const port = env.PORT;

console.log("hostname: ", hostname);

app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`);
})