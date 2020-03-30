const expect  = require('chai').expect;
const url = require('../controller/URL');
const cache = require('../controller/cache');
const configuration = require('../configuration/configuration');
const MockDBManager = require('../mock/mockDBManager');

describe('generate function', function() {

    it('should generate a random string', function(done) {
        const randomPath1 = url.generate();
        const randomPath2 = url.generate();
        expect(randomPath1).to.not.equal(randomPath2);
        done();
    });

    it('should generate a random string that should not exists in cache', function(done) {
        const randomPath = url.generate();
        expect(cache.isValueAvailableForKey(randomPath)).to.be.false;
        done();
    });

    it('should generate a random string of correct length', function(done) {
        const randomPath = url.generate();
        expect(randomPath).to.have.lengthOf(configuration.pathLength);
        done();
    })
});

describe('saveOriginalURL function', function() {
    it('should save original URL for short URL path', function(done) {
        const shortURLPath = '1234567';
        const originalURL = 'https://google.co.in';
        url.saveOriginalURL(new MockDBManager(), shortURLPath, originalURL).then(function(status) {
            expect(status).to.be.true;
            done();
        });
    });

    it('should not save original URL for repeating short URL path', function(done) {
        const shortURLPath = '7654321';
        const originalURL1 = 'https://google.co.in';
        const originalURL2 = 'https://facebook.com';
        url.saveOriginalURL(new MockDBManager(), shortURLPath, originalURL1).then(function(status) {
            expect(status).to.be.true;

            url.saveOriginalURL(new MockDBManager(), shortURLPath, originalURL2).then(function(status) {
                expect(status).to.be.false;
                done();
            });
        });
    });
});

describe('getOriginalURL function', function() {
    it('should return created original URL', function(done) {
        const shortURLPath = '2345678';
        const expectedOriginalURL = 'https://google.co.in';
        cache.setValueForKey(shortURLPath, expectedOriginalURL);
        const actualOriginalURL = url.getOriginalURL(shortURLPath);
        expect(actualOriginalURL).to.equal(expectedOriginalURL);
        done();
    });
});

describe('isShortURLAvailable', function() {
    it('should return true is value is not in cache', function(done) {
        const shortURLPath = '3456789';
        expect(url.isShortURLAvailable(shortURLPath)).to.be.true;
        done();
    });

    it('should return false is value is in cache', function(done) {
        const shortURLPath = '3456789';
        cache.setValueForKey(shortURLPath, 'https://google.co.in');
        expect(url.isShortURLAvailable(shortURLPath)).to.be.false;
        done();
    });
});
