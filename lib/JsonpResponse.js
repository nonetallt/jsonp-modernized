
export default class JsonpResponse
{
    constructor(resolve, reject, callbackName) {
        this.completed = false;
        this.resolve = resolve;
        this.reject = reject;
        this.callbackName = callbackName;
        this.timer = null;
    }

    startTimeout(millis) {

        if(! millis) {
            return;
        }

        this.timer = setTimeout(() => {

            this.cleanup();
            const unit = millis <= 1000 ? 'second' : 'seconds';

            this.reject({
                message: `Request timed out after ${millis / 1000} ${unit}`
            });
        }, millis);
    }

    load(url, timeout) {

        this.script = document.createElement('script');
        this.script.src = url;

        // Create onerror handler to catch connection related errors for loading script
        this.script.onerror = (event) => {
            this.cleanup();
            this.reject({
                message: `Could not load script from ${url} (network error)`,
                previous: event
            });
        };

        // If onload is called before callback, the script could not be executed
        this.script.onload = (event) => {
            if(! this.completed) {
                this.cleanup();
                this.reject({
                    message: `Failed to execute script from ${url} (wrong mime-type)`,
                    previous: event
                });
            }
        }

        if(window[this.callbackName] !== undefined) {
            throw new Error(`Function '${this.callbackName} is already defined for window, possible request conflict'`);
        }

        // Export the callback signature to window so that it can be found by created script
        window[this.callbackName] = (responseData) => {
            this.cleanup();
            this.resolve(responseData);
        };

        let target = document.getElementsByTagName('script')[0] || null;

        if(target !== null) {
            // Insert script before first script tag if any exist
            target.parentNode.insertBefore(this.script, target);
        }
        else {
            // Insert script to head if no script tags exist
            document.head.appendChild(this.script);
        }

        this.startTimeout(timeout);
    }

    cleanup() {

        // Clear timer
        if(this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        // Remove exported callback
        if(window[this.callbackName] !== undefined) {
            delete window[this.callbackName];
        }

        // Remove created script tag from DOM
        if(this.script) {
            if (this.script.parentNode) {
                this.script.parentNode.removeChild(this.script);
            }
        }

        this.completed = true;
    }
}
