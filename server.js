let express = require('express');
let app = express();

// config
let config = require('./config/data');

require('./config/express')(app, express, config);









