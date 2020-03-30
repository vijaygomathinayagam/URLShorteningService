const MongoClient = require('mongodb').MongoClient;
const configuration = require('../configuration/configuration');

const url = `mongodb://${configuration.dbHost}:${configuration.dbPort}`;

module.exports.init = function(appInitFunc) {
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err);
        } else {
            console.log("Database connection created successfully");
    
            const db = client.db(configuration.dbName);
            appInitFunc(db);
    
            process.on('exit', function() {
                client.close();
            });
        }
    });
}