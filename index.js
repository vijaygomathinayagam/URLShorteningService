var express = require('express');
bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const DBManager = require('./db/manager');

var db = require('./db/db');

function initApp(db) {
    const dbManager = new DBManager(db);

    var { initController } = require('./controller/base');
    initController(dbManager).then(() => {
        var { initRoutes } = require('./handler/routes');
        initRoutes(app, dbManager);
    });
}

db.init(initApp);

app.listen(8080, function () {
    console.log('App listening on port 8080!')
});