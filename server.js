let express = require('express');
let app = express();

// config
let config = require('./config/data');

// dowload apk
app.get('/download', (sol, res) => {
    res.download( __dirname +'/downloads/ej.apk', 'easy-jobs-1.0-.apk' )

    
})

require('./config/express')(app, express, config);









