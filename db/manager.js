module.exports = class Manager {
    constructor(db) {
        this.db = db;
    }

    insertValue(dbTableName, value) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTableName).insertOne(value, function(err, result) {
                if(err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    deleteTable(dbTableName) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTableName).drop(function(err, result) {
                if(err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    getAll(dbTableName) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTableName).find({}).toArray(function(err, result) {
                if(err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}