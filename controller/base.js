const url = require('./URL');
const cache = require('./cache');

module.exports.initController = function(dbManager) {
    return new Promise((resolve, reject) => {
        dbManager.getAll(url.URL_MAPPING_ENTITY_NAME).then(function(values) {
            values.forEach(element => {
                cache.setValueForKey(element.shortURLPath, element.originalURL);
            });
            resolve();
        }).catch(function() {});
    });
}