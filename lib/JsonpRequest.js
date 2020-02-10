import isUrl from 'is-url';
import queryString from 'query-string';
import JsonpOptions from './JsonpOptions';
import JsonpResponse from './JsonpResponse';

export default class JsonpRequest
{
    constructor(url, options) {
        this.setUrl(url);
        this.setOptions(options);
    }

    setUrl(url) {
        if(isUrl(url)) {
            this.url = url;
            return;
        }

        const type = typeof url;

        if(type === 'string') {
            const msg = `Given url must be a valid url, '${url}' given`;
            throw new Error(msg);
        }

        const msg = `Given url must be a valid url, ${type} given`;
        throw new Error(msg);
    }

    setOptions(options) {

        if(options instanceof JsonpOptions) {
            this.options = options;
            return;
        }

        if(options === undefined) {
            options = {};
        }

        if(typeof options === 'object') {
            this.options = new JsonpOptions(options);
            return;
        }
        
        const type = typeof url;

        const msg = `Given options must be object or JsonpOptions, ${type} given`;
        throw new Error(msg);
    }

    getUrl() {

        let query = this.options.get('parameters');
        query[this.options.get('callbackParameter')] = this.options.get('callbackFunction');

        const location = {
            url: this.url,
            query: query
        };

        const options = {
            encode: this.options.get('encodeParameters')
        };

        return queryString.stringifyUrl(location, options);
    }

    send() {
        return new Promise((resolve, reject) => {
            const callback = this.options.get('callbackFunction');
            const response = new JsonpResponse(resolve, reject, callback);

            response.load(this.getUrl(), this.options.get('timeout'));
        });
    }
}
