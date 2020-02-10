import isCallable from 'is-callable';
import upperFirst from 'lodash.upperfirst';

const defaults = {
    callbackFunction: '__jp[ID]',
    callbackParameter: 'callback',
    timeout: 60000,
    parameters: {},
    encodeParameters: true
};

export default class JsonpOptions
{
    constructor(options = {}) {

        this.attributes = {
            id: Math.random().toString(36).substr(2)
        };

        Object.keys(options).forEach(key => {
            this.set(key, options[key]);
        });
    }

    /**
     * Set value of the given option
     *
     */
    set(key, value) {
        if(defaults[key] === undefined) {
            throw new Error(`Unknown option ${key}`);
        }

        this[key] = value;
    }

    /**
     * Get value of the given option, compared to simply accessing public
     * properties, this method also returns the default value for the property
     * if no value has been set.
     *
     */
    get(key) {
        let value = this.attributes[key] || defaults[key] ||null;

        if(value === null) {
            throw new Error(`Unknown option ${key}`);
        }

        // Mutate value if validator is defined
        const method = `mutate${upperFirst(key)}`

        if(isCallable(this[method])) {
            value = this[method](value);
        }

        return value;
    }

    set callbackFunction(value) {
        if(typeof value !== 'string') {
            throw new Error("Callback function must be a string of at least 1 character long");
        }

        this.attributes.callbackFunction = value;
    }

    /**
     * Replace placeholders from callbackFunction
     *
     */
    mutateCallbackFunction(value) {
        return value.replace('[ID]', this.attributes.id);
    }

    set callbackParameter(value) {
        if(typeof value !== 'string') {
            throw new Error("Callback parameter must be a string of at least 1 character long");
        }

        this.attributes.callbackParameter = value;
    }

    set parameters(value) {
        if(typeof value !== 'object') {
            throw new Error("Parameters must be an object");
        }

        this.attributes.parameters = value;
    }

    set timeout(value) {
        
        if(! Number.isInteger(value) || value < 0) {
            throw new Error("Timeout must be false or integer value of at least 0");
        }

        if(value === 0) {
            value = false;
        }

        this.attributes.timeout = value;
    }

    set encodeParameters(value) {
        if(typeof value !== 'boolean') {
            throw new Error("Encode parameters must be a boolean");
        }

        this.attributes.encodeParameters = value;
    }
}
