const randomstring = require("randomstring");
const configuration = require('../configuration/configuration');
const cache = require('../controller/cache');
const schedule = require('node-schedule');

const urlExpiryStatus = {
    inProgress: false,
    expiryPromise: undefined
};

const URL_MAPPING_ENTITY_NAME = 'urlmapping';

function generate() {
    let randomPath = randomstring.generate(configuration.pathLength);
    while(cache.isValueAvailableForKey(randomPath)) {
        randomPath = randomstring.generate(configuration.pathLength);
    }
    return randomPath;
}

function isOriginalURLSaved(originalURL) {
    return !!cache.getkeyForValue(originalURL);
}

function saveOriginalURL(dbManager, shortURLPath, originalURL) {
    return new Promise(function(resolve, reject) {
        if (isShortURLAvailable(shortURLPath)) {
            cache.setValueForKey(shortURLPath, originalURL);
            dbManager.insertValue(URL_MAPPING_ENTITY_NAME, {
                shortURLPath: shortURLPath,
                originalURL: originalURL
            }).then(function() {
                resolve(true);
            }).catch(function() {
                reject();
            });
        } else {
            resolve(false);
        }
    });
}

function getOriginalURL(shortURLPath) {
    return cache.getValeuForKey(shortURLPath);
}

function isShortURLAvailable(shortURLPath) {
    return !cache.isValueAvailableForKey(shortURLPath);
}

function expiryAllURLs(dbManager) {
    urlExpiryStatus.expiryPromise = new Promise(function(resolve, reject){
        dbManager.deleteTable(URL_MAPPING_ENTITY_NAME).then(function() {
            cache.clearCache();
            resolve();
        }).catch(function() { resolve() });
    });
    urlExpiryStatus.inProgress = true;
}

// scheduling url expiry at every midnight
function scheduleURLExpiryJob(dbManager) {
    schedule.scheduleJob('0 0 * * *', () => { expiryAllURLs(dbManager) });
}

module.exports = {
    generate,
    saveOriginalURL,
    getOriginalURL,
    isOriginalURLSaved,
    isShortURLAvailable,
    urlExpiryStatus,
    scheduleURLExpiryJob,
    URL_MAPPING_ENTITY_NAME
}