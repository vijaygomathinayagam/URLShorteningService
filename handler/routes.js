const url = require('../controller/URL');
const api = require('express').Router();
var configuration = require('../configuration/configuration');

module.exports.initRoutes = function(app, dbManager) {
    app.use(configuration.apiPath, api);
    url.scheduleURLExpiryJob(dbManager);

    const expiryCheckMiddleware = function(req, res, next) {
        if(!url.urlExpiryStatus.inProgress) {
            next();
        } else {
            url.urlExpiryStatus.expiryPromise.then(function() {
                next();
            });
        }
    }

    // api routes
    api.get('/generate', expiryCheckMiddleware, function (req, res) {
        res.json({
            shortURLPath: url.generate()
        });
    });

    api.post('/save-original-url', expiryCheckMiddleware, function(req, res) {
        const { shortURL, originalURL } = req.body;
        console.log(req.body);
        url.saveOriginalURL(dbManager, shortURL, originalURL).then(function(status) {
            if(status) {
                res.json({ isSuccess: true });
            } else {
                res.status(400).end();
            }
        });
    });

    api.get('/is-original-url-saved', expiryCheckMiddleware, function(req, res) {
        const originalURL = req.query.originalURL;
        res.json({
            isSaved: url.isOriginalURLSaved(originalURL)
        });
    })

    api.get('/is-short-url-available', expiryCheckMiddleware, function(req, res) {
        const shortURL= req.query.shortURL;
        res.json({
            isAvailable: url.isShortURLAvailable(shortURL)
        });
    });

    api.get('/', function(req, res) {
        // api not implemented
        res.status(501).end();
    });

    // redirection routes
    app.get('/:shortURL', expiryCheckMiddleware, function(req, res) {
        const originalURL = url.getOriginalURL(req.params.shortURL);
        if (originalURL) {
            res.redirect(originalURL);
        } else {
            res.redirect(configuration.notFoundPath);
        }
    });
}