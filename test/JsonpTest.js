const fs = require('fs');
const assert = require('assert');
const jsdom = require('mocha-jsdom');
const lib = __dirname + '/../dist/jsonp.js';
const url = 'https://example.org';

describe('jsonp()', function() {

    // initialize DOM
    jsdom({
        url: 'https://example.org/',
        src: fs.readFileSync(lib, 'utf-8'),
        runScripts: 'dangerously',
        resources: 'usable'
    });

    afterEach(function() {
        // Remove all generated script tags
        const scripts = document.getElementsByTagName('script');

        for(let script of scripts) {
            script.remove();
        }
    });

    /***
     * Tests related to DOM elements
     *
     */
    describe('DOM', function() {

        /**
         * Test that initial document has not script tags
         *
         */
        it("Has no script tags in head", function() {
            assert.equal(document.head.getElementsByTagName('script').length, 0);
        });

        /**
         * Test that a script tag with correct source is injected when jsonp is
         * called
         *
         */
        it("Prepends script tag into head", function() {
            jsonp(url, {callbackParameter: 'foo', callbackFunction: 'bar'});
            const scripts = document.head.getElementsByTagName('script');

            assert.equal(scripts['0'].src, `${url}/?foo=bar`);
        });

        /**
         * Test that generated script tag is removed on resolution
         *
         */
        it("Removes script tag from head when callback is called", function() {

            jsonp(url, {callbackFunction: 'foo'});
            window.foo('bar');

            assert.equal(document.head.getElementsByTagName('script').length, 0);
        });

        /**
         * Test that generated script tag is removed on rejection
         *
         */
        it("Removes script tag from head when appended script onerror is called", function() {

            jsonp(url).catch(error => {
            });

            document.head.getElementsByTagName('script')['0'].onerror({});

            assert.equal(document.head.getElementsByTagName('script').length, 0);
        });

        /**
         * Test that gnerated script tag is removed on timeout
         *
         */
        it("Removes script tag from head when timed out", function() {

            return jsonp(url, {timeout: 1}).catch(function(error) {
                assert.equal(document.head.getElementsByTagName('script').length, 0);
            });
        });
    });

    /**
     * Tests related to http requests
     *
     */
    describe('request', function() {

        it("Should reject promise when request timed out", function() {

            return jsonp(url, {timeout: 1}).catch(function(error) {
                assert.equal(error.message, 'Request timed out after 0.001 second');
            });
        });

        // it("Should reject promise when server can't be reached", function() {

        //     return jsonp(url).catch(function(error) {
        //         assert.equal(error.message, `Could not load script from ${url}`);
        //     });
        // });

        // it("Should resolve promise when server is reached", function() {

        //     return jsonp(url).then(function(response) {
        //         assert.equal(response, {foo: bar});
        //     });
        // });
    });

});
