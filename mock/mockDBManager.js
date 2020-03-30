const emptyPromiseReturnFunction = () => {
    return new Promise(function(resolve, reject) {
        resolve();
    });
};

module.exports = class {
    insertValue(dbTableName, value) {
        return emptyPromiseReturnFunction();
    }

    deleteTable(dbTableName) {
        return emptyPromiseReturnFunction();
    }

    getAll(dbTableName) { 
        return emptyPromiseReturnFunction();
    }
};